from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models.planilla import Planilla
from app.models.periodo import Periodo
from app.models.empleado import Empleado
from app.schemas.planilla import PlanillaCreate, PlanillaResponse, PlanillaUpdate
from app import calculos

TOPE_AGUINALDO_EXENTO = 1500.0
router = APIRouter(prefix="/planilla", tags=["Planilla"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PlanillaResponse)
def crear_planilla(planilla_in: PlanillaCreate, db: Session = Depends(get_db)):
    periodo = db.query(Periodo).filter(Periodo.id == planilla_in.periodo_id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="Período no encontrado")
    empleado = db.query(Empleado).filter(Empleado.id == planilla_in.empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Validar duplicado de planilla
    existente = db.query(Planilla).filter(
        Planilla.empleado_id == planilla_in.empleado_id,
        Planilla.periodo_id == planilla_in.periodo_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una planilla para este empleado en el período seleccionado.")

    # --- CÁLCULO DE AGUINALDO ---
    monto_aguinaldo = 0.0
    if planilla_in.pagar_aguinaldo:
        if periodo.mes not in [10, 11, 12]:
            raise HTTPException(status_code=400, detail="El aguinaldo solo se puede pagar en octubre, noviembre o diciembre.")
        
        año_actual = periodo.año
        aguinaldo_existente = db.query(Planilla).join(Periodo).filter(
            Planilla.empleado_id == planilla_in.empleado_id,
            Periodo.año == año_actual,
            Planilla.monto_aguinaldo > 0
        ).first()
        if aguinaldo_existente:
            raise HTTPException(status_code=400, detail="Este empleado ya recibió aguinaldo en el año actual.")
        
        sueldo_base = planilla_in.sueldo_base
        monto_aguinaldo = calculos.calcular_aguinaldo(sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)

    aguinaldo_gravado = max(0, monto_aguinaldo - TOPE_AGUINALDO_EXENTO)

    # --- RESTO DE CÁLCULOS ---
    sueldo_base = planilla_in.sueldo_base
    valor_hora = calculos.calcular_valor_hora(sueldo_base)

    monto_extra_diurnas = calculos.calcular_horas_extras_diurnas(planilla_in.horas_extras_diurnas, valor_hora)
    monto_extra_nocturnas = calculos.calcular_horas_extras_nocturnas(planilla_in.horas_extras_nocturnas, valor_hora)

    monto_vacaciones = calculos.calcular_monto_vacaciones(sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)
    
    # ========== 🔽 CAMBIO AQUÍ ==========
    # Quincena 25 (con proporcionalidad y parámetros adicionales)
    monto_quincena25 = calculos.calcular_quincena25(
        sueldo_base,
        planilla_in.quincena25_aplica,
        empleado.fecha_ingreso,
        periodo.fecha_corte
    )
    # ========== 🔼 FIN DEL CAMBIO ==========

    descuentos_adicionales = planilla_in.descuentos_adicionales or 0

    total_ingresos = (sueldo_base +
                      monto_extra_diurnas +
                      monto_extra_nocturnas +
                      planilla_in.subsidio_alimentacion +
                      planilla_in.bono_extra +
                      monto_aguinaldo +
                      monto_vacaciones +
                      monto_quincena25)

    monto_cotizable = (sueldo_base +
                       monto_extra_diurnas +
                       monto_extra_nocturnas +
                       monto_vacaciones +
                       planilla_in.bono_extra +
                       aguinaldo_gravado)

    isss_emp = calculos.calcular_isss(monto_cotizable)
    afp_emp = calculos.calcular_afp(monto_cotizable)
    base_isr = monto_cotizable - isss_emp - afp_emp
    isr = calculos.calcular_isr(base_isr)

    total_deducciones = isss_emp + afp_emp + isr + descuentos_adicionales
    monto_neto = total_ingresos - total_deducciones

    isss_patronal = monto_cotizable * calculos.ISSS_PATRONAL_PCT
    afp_patronal = monto_cotizable * calculos.AFP_PATRONAL_PCT
    monto_planilla_unica = isss_emp + afp_emp + isss_patronal + afp_patronal

    # --- CREAR REGISTRO ---
    nueva = Planilla(
        periodo_id=planilla_in.periodo_id,
        empleado_id=planilla_in.empleado_id,
        sueldo_base=sueldo_base,
        horas_extras_diurnas=planilla_in.horas_extras_diurnas,
        horas_extras_nocturnas=planilla_in.horas_extras_nocturnas,
        subsidio_alimentacion=planilla_in.subsidio_alimentacion,
        bono_extra=planilla_in.bono_extra,
        quincena25_aplica=planilla_in.quincena25_aplica,
        valor_hora=valor_hora,
        monto_horas_extras_diurnas=monto_extra_diurnas,
        monto_horas_extras_nocturnas=monto_extra_nocturnas,
        monto_aguinaldo=monto_aguinaldo,
        monto_vacaciones=0,
        monto_quincena25=monto_quincena25,
        monto_isss=isss_emp,
        monto_afp=afp_emp,
        monto_isr=isr,
        monto_isss_patronal=isss_patronal,
        monto_afp_patronal=afp_patronal,
        monto_planilla_unica=monto_planilla_unica,
        monto_cotizable=monto_cotizable,
        total_ingresos=total_ingresos,
        total_deducciones=total_deducciones,
        monto_neto=monto_neto,
        descuentos_adicionales=descuentos_adicionales
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    response_data = {
        "id": nueva.id,
        "periodo_id": nueva.periodo_id,
        "empleado_id": nueva.empleado_id,
        "sueldo_base": nueva.sueldo_base,
        "horas_extras_diurnas": nueva.horas_extras_diurnas,
        "horas_extras_nocturnas": nueva.horas_extras_nocturnas,
        "subsidio_alimentacion": nueva.subsidio_alimentacion,
        "bono_extra": nueva.bono_extra,
        "quincena25_aplica": nueva.quincena25_aplica,
        "valor_hora": nueva.valor_hora,
        "monto_horas_extras_diurnas": nueva.monto_horas_extras_diurnas,
        "monto_horas_extras_nocturnas": nueva.monto_horas_extras_nocturnas,
        "monto_aguinaldo": nueva.monto_aguinaldo,
        "aguinaldo_gravado": aguinaldo_gravado,
        "monto_vacaciones": monto_vacaciones,
        "monto_quincena25": nueva.monto_quincena25,
        "monto_isss": nueva.monto_isss,
        "monto_afp": nueva.monto_afp,
        "monto_isr": nueva.monto_isr,
        "monto_isss_patronal": nueva.monto_isss_patronal,
        "monto_afp_patronal": nueva.monto_afp_patronal,
        "monto_planilla_unica": nueva.monto_planilla_unica,
        "monto_cotizable": nueva.monto_cotizable,
        "total_ingresos": nueva.total_ingresos,
        "total_deducciones": nueva.total_deducciones,
        "monto_neto": nueva.monto_neto,
        "descuentos_adicionales": nueva.descuentos_adicionales,
        "pagar_aguinaldo": planilla_in.pagar_aguinaldo
    }
    return PlanillaResponse(**response_data)

@router.put("/{id}", response_model=PlanillaResponse)
def actualizar_planilla(id: int, planilla_in: PlanillaUpdate, db: Session = Depends(get_db)):
    planilla = db.query(Planilla).filter(Planilla.id == id).first()
    if not planilla:
        raise HTTPException(status_code=404, detail="Planilla no encontrada")

    periodo = db.query(Periodo).filter(Periodo.id == planilla_in.periodo_id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="Período no encontrado")
    empleado = db.query(Empleado).filter(Empleado.id == planilla_in.empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    existente = db.query(Planilla).filter(
        Planilla.empleado_id == planilla_in.empleado_id,
        Planilla.periodo_id == planilla_in.periodo_id,
        Planilla.id != id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe otra planilla para este empleado en el período seleccionado.")

    # --- AGUINALDO ---
    monto_aguinaldo = 0.0
    if planilla_in.pagar_aguinaldo:
        if periodo.mes not in [10, 11, 12]:
            raise HTTPException(status_code=400, detail="El aguinaldo solo se puede pagar en octubre, noviembre o diciembre.")
        
        año_actual = periodo.año
        aguinaldo_existente = db.query(Planilla).join(Periodo).filter(
            Planilla.empleado_id == planilla_in.empleado_id,
            Periodo.año == año_actual,
            Planilla.monto_aguinaldo > 0,
            Planilla.id != id
        ).first()
        if aguinaldo_existente:
            raise HTTPException(status_code=400, detail="Este empleado ya recibió aguinaldo en el año actual.")
        
        sueldo_base = planilla_in.sueldo_base
        monto_aguinaldo = calculos.calcular_aguinaldo(sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)

    aguinaldo_gravado = max(0, monto_aguinaldo - TOPE_AGUINALDO_EXENTO)

    # --- RESTO DE CÁLCULOS ---
    sueldo_base = planilla_in.sueldo_base
    valor_hora = calculos.calcular_valor_hora(sueldo_base)
    monto_extra_diurnas = calculos.calcular_horas_extras_diurnas(planilla_in.horas_extras_diurnas, valor_hora)
    monto_extra_nocturnas = calculos.calcular_horas_extras_nocturnas(planilla_in.horas_extras_nocturnas, valor_hora)

    monto_vacaciones = calculos.calcular_monto_vacaciones(sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)
    
    # ========== 🔽 CAMBIO AQUÍ ==========
    # Quincena 25 (con proporcionalidad y parámetros adicionales)
    monto_quincena25 = calculos.calcular_quincena25(
        sueldo_base,
        planilla_in.quincena25_aplica,
        empleado.fecha_ingreso,
        periodo.fecha_corte
    )
    # ========== 🔼 FIN DEL CAMBIO ==========

    descuentos_adicionales = planilla_in.descuentos_adicionales or 0

    total_ingresos = (sueldo_base +
                      monto_extra_diurnas +
                      monto_extra_nocturnas +
                      planilla_in.subsidio_alimentacion +
                      planilla_in.bono_extra +
                      monto_aguinaldo +
                      monto_vacaciones +
                      monto_quincena25)

    monto_cotizable = (sueldo_base +
                       monto_extra_diurnas +
                       monto_extra_nocturnas +
                       monto_vacaciones +
                       planilla_in.bono_extra +
                       aguinaldo_gravado)

    isss_emp = calculos.calcular_isss(monto_cotizable)
    afp_emp = calculos.calcular_afp(monto_cotizable)
    base_isr = monto_cotizable - isss_emp - afp_emp
    isr = calculos.calcular_isr(base_isr)

    total_deducciones = isss_emp + afp_emp + isr + descuentos_adicionales
    monto_neto = total_ingresos - total_deducciones

    isss_patronal = monto_cotizable * calculos.ISSS_PATRONAL_PCT
    afp_patronal = monto_cotizable * calculos.AFP_PATRONAL_PCT
    monto_planilla_unica = isss_emp + afp_emp + isss_patronal + afp_patronal

    # Actualizar campos
    planilla.periodo_id = planilla_in.periodo_id
    planilla.empleado_id = planilla_in.empleado_id
    planilla.sueldo_base = planilla_in.sueldo_base
    planilla.horas_extras_diurnas = planilla_in.horas_extras_diurnas
    planilla.horas_extras_nocturnas = planilla_in.horas_extras_nocturnas
    planilla.subsidio_alimentacion = planilla_in.subsidio_alimentacion
    planilla.bono_extra = planilla_in.bono_extra
    planilla.quincena25_aplica = planilla_in.quincena25_aplica
    planilla.valor_hora = valor_hora
    planilla.monto_horas_extras_diurnas = monto_extra_diurnas
    planilla.monto_horas_extras_nocturnas = monto_extra_nocturnas
    planilla.monto_aguinaldo = monto_aguinaldo
    planilla.monto_vacaciones = 0
    planilla.monto_quincena25 = monto_quincena25
    planilla.monto_isss = isss_emp
    planilla.monto_afp = afp_emp
    planilla.monto_isr = isr
    planilla.monto_isss_patronal = isss_patronal
    planilla.monto_afp_patronal = afp_patronal
    planilla.monto_planilla_unica = monto_planilla_unica
    planilla.monto_cotizable = monto_cotizable
    planilla.total_ingresos = total_ingresos
    planilla.total_deducciones = total_deducciones
    planilla.monto_neto = monto_neto
    planilla.descuentos_adicionales = descuentos_adicionales

    db.commit()
    db.refresh(planilla)

    response_data = {
        "id": planilla.id,
        "periodo_id": planilla.periodo_id,
        "empleado_id": planilla.empleado_id,
        "sueldo_base": planilla.sueldo_base,
        "horas_extras_diurnas": planilla.horas_extras_diurnas,
        "horas_extras_nocturnas": planilla.horas_extras_nocturnas,
        "subsidio_alimentacion": planilla.subsidio_alimentacion,
        "bono_extra": planilla.bono_extra,
        "quincena25_aplica": planilla.quincena25_aplica,
        "valor_hora": planilla.valor_hora,
        "monto_horas_extras_diurnas": planilla.monto_horas_extras_diurnas,
        "monto_horas_extras_nocturnas": planilla.monto_horas_extras_nocturnas,
        "monto_aguinaldo": planilla.monto_aguinaldo,
        "aguinaldo_gravado": aguinaldo_gravado,
        "monto_vacaciones": monto_vacaciones,
        "monto_quincena25": planilla.monto_quincena25,
        "monto_isss": planilla.monto_isss,
        "monto_afp": planilla.monto_afp,
        "monto_isr": planilla.monto_isr,
        "monto_isss_patronal": planilla.monto_isss_patronal,
        "monto_afp_patronal": planilla.monto_afp_patronal,
        "monto_planilla_unica": planilla.monto_planilla_unica,
        "monto_cotizable": planilla.monto_cotizable,
        "total_ingresos": planilla.total_ingresos,
        "total_deducciones": planilla.total_deducciones,
        "monto_neto": planilla.monto_neto,
        "descuentos_adicionales": planilla.descuentos_adicionales,
        "pagar_aguinaldo": planilla_in.pagar_aguinaldo
    }
    return PlanillaResponse(**response_data)

@router.delete("/{id}")
def eliminar_planilla(id: int, db: Session = Depends(get_db)):
    planilla = db.query(Planilla).filter(Planilla.id == id).first()
    if not planilla:
        raise HTTPException(status_code=404, detail="Planilla no encontrada")
    db.delete(planilla)
    db.commit()
    return {"ok": True}

@router.get("/", response_model=List[PlanillaResponse])
def listar_planillas(db: Session = Depends(get_db)):
    planillas = db.query(Planilla).all()
    resultado = []
    for pl in planillas:
        periodo = db.query(Periodo).filter(Periodo.id == pl.periodo_id).first()
        empleado = db.query(Empleado).filter(Empleado.id == pl.empleado_id).first()
        
        monto_vacaciones = 0.0
        if periodo and empleado:
            monto_vacaciones = calculos.calcular_monto_vacaciones(pl.sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)
        
        monto_aguinaldo = float(pl.monto_aguinaldo) if pl.monto_aguinaldo else 0.0
        aguinaldo_gravado = max(0, monto_aguinaldo - TOPE_AGUINALDO_EXENTO)
        
        monto_cotizable = (float(pl.sueldo_base) +
                           float(pl.monto_horas_extras_diurnas) +
                           float(pl.monto_horas_extras_nocturnas) +
                           float(monto_vacaciones) +
                           float(pl.bono_extra) +
                           aguinaldo_gravado)

        isss_emp = calculos.calcular_isss(monto_cotizable)
        afp_emp = calculos.calcular_afp(monto_cotizable)
        base_isr = monto_cotizable - isss_emp - afp_emp
        isr = calculos.calcular_isr(base_isr)
        total_deducciones = isss_emp + afp_emp + isr
        monto_neto = float(pl.total_ingresos) - total_deducciones

        isss_patronal = monto_cotizable * calculos.ISSS_PATRONAL_PCT
        afp_patronal = monto_cotizable * calculos.AFP_PATRONAL_PCT
        monto_planilla_unica = isss_emp + afp_emp + isss_patronal + afp_patronal

        response_data = {
            "id": pl.id,
            "periodo_id": pl.periodo_id,
            "empleado_id": pl.empleado_id,
            "sueldo_base": pl.sueldo_base,
            "horas_extras_diurnas": pl.horas_extras_diurnas,
            "horas_extras_nocturnas": pl.horas_extras_nocturnas,
            "subsidio_alimentacion": pl.subsidio_alimentacion,
            "bono_extra": pl.bono_extra,
            "quincena25_aplica": pl.quincena25_aplica,
            "valor_hora": pl.valor_hora,
            "monto_horas_extras_diurnas": pl.monto_horas_extras_diurnas,
            "monto_horas_extras_nocturnas": pl.monto_horas_extras_nocturnas,
            "monto_aguinaldo": pl.monto_aguinaldo,
            "aguinaldo_gravado": aguinaldo_gravado,
            "monto_vacaciones": monto_vacaciones,
            "monto_quincena25": pl.monto_quincena25,
            "monto_isss": isss_emp,
            "monto_afp": afp_emp,
            "monto_isr": isr,
            "monto_isss_patronal": isss_patronal,
            "monto_afp_patronal": afp_patronal,
            "monto_planilla_unica": monto_planilla_unica,
            "monto_cotizable": monto_cotizable,
            "total_ingresos": pl.total_ingresos,
            "total_deducciones": total_deducciones,
            "monto_neto": monto_neto,
            "descuentos_adicionales": pl.descuentos_adicionales or 0
        }
        resultado.append(PlanillaResponse(**response_data))
    return resultado

@router.get("/{id}", response_model=PlanillaResponse)
def obtener_planilla(id: int, db: Session = Depends(get_db)):
    pl = db.query(Planilla).filter(Planilla.id == id).first()
    if not pl:
        raise HTTPException(status_code=404, detail="Planilla no encontrada")
    
    periodo = db.query(Periodo).filter(Periodo.id == pl.periodo_id).first()
    empleado = db.query(Empleado).filter(Empleado.id == pl.empleado_id).first()
    
    monto_vacaciones = 0.0
    if periodo and empleado:
        monto_vacaciones = calculos.calcular_monto_vacaciones(pl.sueldo_base, empleado.fecha_ingreso, periodo.fecha_corte)
    
    monto_aguinaldo = float(pl.monto_aguinaldo) if pl.monto_aguinaldo else 0.0
    aguinaldo_gravado = max(0, monto_aguinaldo - TOPE_AGUINALDO_EXENTO)
    
    monto_cotizable = (float(pl.sueldo_base) +
                       float(pl.monto_horas_extras_diurnas) +
                       float(pl.monto_horas_extras_nocturnas) +
                       float(monto_vacaciones) +
                       float(pl.bono_extra) +
                       aguinaldo_gravado)

    isss_emp = calculos.calcular_isss(monto_cotizable)
    afp_emp = calculos.calcular_afp(monto_cotizable)
    base_isr = monto_cotizable - isss_emp - afp_emp
    isr = calculos.calcular_isr(base_isr)
    total_deducciones = isss_emp + afp_emp + isr
    monto_neto = float(pl.total_ingresos) - total_deducciones

    isss_patronal = monto_cotizable * calculos.ISSS_PATRONAL_PCT
    afp_patronal = monto_cotizable * calculos.AFP_PATRONAL_PCT
    monto_planilla_unica = isss_emp + afp_emp + isss_patronal + afp_patronal

    response_data = {
        "id": pl.id,
        "periodo_id": pl.periodo_id,
        "empleado_id": pl.empleado_id,
        "sueldo_base": pl.sueldo_base,
        "horas_extras_diurnas": pl.horas_extras_diurnas,
        "horas_extras_nocturnas": pl.horas_extras_nocturnas,
        "subsidio_alimentacion": pl.subsidio_alimentacion,
        "bono_extra": pl.bono_extra,
        "quincena25_aplica": pl.quincena25_aplica,
        "valor_hora": pl.valor_hora,
        "monto_horas_extras_diurnas": pl.monto_horas_extras_diurnas,
        "monto_horas_extras_nocturnas": pl.monto_horas_extras_nocturnas,
        "monto_aguinaldo": pl.monto_aguinaldo,
        "aguinaldo_gravado": aguinaldo_gravado,
        "monto_vacaciones": monto_vacaciones,
        "monto_quincena25": pl.monto_quincena25,
        "monto_isss": isss_emp,
        "monto_afp": afp_emp,
        "monto_isr": isr,
        "monto_isss_patronal": isss_patronal,
        "monto_afp_patronal": afp_patronal,
        "monto_planilla_unica": monto_planilla_unica,
        "monto_cotizable": monto_cotizable,
        "total_ingresos": pl.total_ingresos,
        "total_deducciones": total_deducciones,
        "monto_neto": monto_neto,
        "descuentos_adicionales": pl.descuentos_adicionales or 0
    }
    return PlanillaResponse(**response_data)