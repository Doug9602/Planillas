from pydantic import BaseModel
from datetime import date

class EmpleadoCreate(BaseModel):
    nombre: str
    dui: str
    area: str
    puesto: str
    salario_mensual: float
    fecha_ingreso: date

class EmpleadoUpdate(EmpleadoCreate):
    pass  # mismos campos que creación (incluye dui)

class EmpleadoResponse(EmpleadoCreate):
    id: int

    class Config:
        from_attributes = True