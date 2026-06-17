from sqlalchemy import Column, Integer, Numeric, Boolean, ForeignKey
from app.database import Base

class Planilla(Base):
    __tablename__ = "planillas"

    id = Column(Integer, primary_key=True, index=True)
    periodo_id = Column(Integer, ForeignKey("periodos.id"), nullable=False)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)

    # Datos de entrada (ingresados por el usuario)
    sueldo_base = Column(Numeric(10,2), nullable=False)
    horas_extras_diurnas = Column(Numeric(5,2), default=0)
    horas_extras_nocturnas = Column(Numeric(5,2), default=0)
    horas_nocturnas = Column(Numeric(5,2), default=0)
    subsidio_alimentacion = Column(Numeric(10,2), default=0)
    bono_extra = Column(Numeric(10,2), default=0)
    quincena25_aplica = Column(Boolean, default=False)

    # Montos calculados automáticamente por el backend
    valor_hora = Column(Numeric(10,4), default=0)
    monto_horas_extras_diurnas = Column(Numeric(10,2), default=0)
    monto_horas_extras_nocturnas = Column(Numeric(10,2), default=0)
    monto_horas_nocturnas = Column(Numeric(10,2), default=0)
    monto_aguinaldo = Column(Numeric(10,2), default=0)
    monto_vacaciones = Column(Numeric(10,2), default=0)
    monto_quincena25 = Column(Numeric(10,2), default=0)

    # Deducciones y patronales
    monto_isss = Column(Numeric(10,2), default=0)
    monto_afp = Column(Numeric(10,2), default=0)
    monto_isr = Column(Numeric(10,2), default=0)
    monto_isss_patronal = Column(Numeric(10,2), default=0)
    monto_afp_patronal = Column(Numeric(10,2), default=0)

    # Totales
    total_ingresos = Column(Numeric(10,2), default=0)
    total_deducciones = Column(Numeric(10,2), default=0)
    monto_neto = Column(Numeric(10,2), default=0)