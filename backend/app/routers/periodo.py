# app/routes/periodo.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import SessionLocal
from app.models.periodo import Periodo
from app.models.planilla import Planilla
from app.schemas.periodo import PeriodoCreate, PeriodoResponse

router = APIRouter(prefix="/periodo", tags=["Periodo"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ FUNCIÓN DE VALIDACIÓN PARA PERÍODOS DUPLICADOS
def validar_periodo_duplicado(db: Session, mes: int, año: int, excluir_id: int = None):
    """
    Verifica si ya existe un período con el mismo mes y año.
    
    Args:
        db: Sesión de base de datos
        mes: Número del mes (1-12)
        año: Año del período
        excluir_id: ID a excluir (para actualizaciones)
    
    Returns:
        bool: True si existe duplicado, False si no
    """
    query = db.query(Periodo).filter(
        Periodo.mes == mes,
        Periodo.año == año
    )
    
    if excluir_id is not None:
        query = query.filter(Periodo.id != excluir_id)
    
    return query.first() is not None

@router.post("/", response_model=PeriodoResponse, status_code=status.HTTP_201_CREATED)
def crear_periodo(periodo_in: PeriodoCreate, db: Session = Depends(get_db)):
    # ✅ VALIDAR QUE NO EXISTA DUPLICADO
    if validar_periodo_duplicado(db, periodo_in.mes, periodo_in.año):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un período para el mes {periodo_in.mes} y año {periodo_in.año}"
        )
    
    nuevo = Periodo(
        mes=periodo_in.mes,
        año=periodo_in.año,
        fecha_corte=periodo_in.fecha_corte,
        total_general=periodo_in.total_general or 0,
        descripcion=periodo_in.descripcion
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[PeriodoResponse])
def listar_periodos(db: Session = Depends(get_db)):
    return db.query(Periodo).all()
    
@router.get("/{id}", response_model=PeriodoResponse)
def obtener_periodo(id: int, db: Session = Depends(get_db)):
    per = db.query(Periodo).filter(Periodo.id == id).first()
    if not per:
        raise HTTPException(status_code=404, detail="Período no encontrado")
    return per

@router.delete("/{id}")
def eliminar_periodo(id: int, db: Session = Depends(get_db)):
    per = db.query(Periodo).filter(Periodo.id == id).first()
    if not per:
        raise HTTPException(status_code=404, detail="Período no encontrado")
    
    try:
        db.delete(per)
        db.commit()
        return {"ok": True}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el período porque tiene planillas asociadas. Primero elimina las planillas asociadas."
        )

@router.put("/{id}", response_model=PeriodoResponse)
def actualizar_periodo(id: int, periodo_in: PeriodoCreate, db: Session = Depends(get_db)):
    periodo = db.query(Periodo).filter(Periodo.id == id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="Período no encontrado")
    
    # ✅ VALIDAR QUE NO EXISTA DUPLICADO (excluyendo el período actual)
    if validar_periodo_duplicado(db, periodo_in.mes, periodo_in.año, excluir_id=id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe otro período con el mes {periodo_in.mes} y año {periodo_in.año}"
        )
    
    # Actualizar todos los campos
    for key, value in periodo_in.model_dump().items():
        setattr(periodo, key, value)
    
    db.commit()
    db.refresh(periodo)
    return periodo