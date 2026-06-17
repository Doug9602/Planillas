from sqlalchemy import Column, Integer, Numeric, Date
from app.database import Base

class Periodo(Base):
    __tablename__ = "periodos"

    id = Column(Integer, primary_key=True, index=True)
    mes = Column(Integer, nullable=False)
    año = Column(Integer, nullable=False)
    fecha_corte = Column(Date, nullable=False)
    total_general = Column(Numeric(12,2), default=0)