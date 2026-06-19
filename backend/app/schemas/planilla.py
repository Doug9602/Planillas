from pydantic import BaseModel

class PlanillaCreate(BaseModel):
    periodo_id: int
    empleado_id: int
    sueldo_base: float
    horas_extras_diurnas: float = 0
    horas_extras_nocturnas: float = 0
    horas_nocturnas: float = 0
    subsidio_alimentacion: float = 0
    bono_extra: float = 0
    quincena25_aplica: bool = False

class PlanillaUpdate(PlanillaCreate):
    pass

class PlanillaResponse(PlanillaCreate):
    id: int
    valor_hora: float
    monto_horas_extras_diurnas: float
    monto_horas_extras_nocturnas: float
    monto_horas_nocturnas: float
    monto_vacaciones: float         
    monto_aguinaldo: float
    aguinaldo_gravado: float
    monto_quincena25: float
    monto_isss: float
    monto_afp: float
    monto_isr: float
    monto_isss_patronal: float
    monto_afp_patronal: float
    total_ingresos: float
    total_deducciones: float
    monto_neto: float
    monto_planilla_unica: float 
    monto_cotizable: float 

    class Config:
        from_attributes = True