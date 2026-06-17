 
from sqlalchemy import Column, Integer, String, Numeric, Date
from app.database import Base

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    dui = Column(String(10), unique=True, nullable=False)  # <-- Agrega esta línea
    area = Column(String(50), nullable=False)
    puesto = Column(String(100), nullable=False)
    salario_mensual = Column(Numeric(10,2), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)