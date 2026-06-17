from pydantic import BaseModel
from datetime import date

class PeriodoCreate(BaseModel):
    mes: int
    año: int
    fecha_corte: date
    total_general: float = 0

class PeriodoResponse(PeriodoCreate):
    id: int

    class Config:
        from_attributes = True