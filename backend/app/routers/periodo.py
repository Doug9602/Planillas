from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/", response_model=PeriodoResponse)
def crear_periodo(periodo_in: PeriodoCreate, db: Session = Depends(get_db)):
    nuevo = Periodo(
        mes=periodo_in.mes,
        año=periodo_in.año,
        fecha_corte=periodo_in.fecha_corte,
        total_general=periodo_in.total_general or 0,
        descripcion=periodo_in.descripcion  # NUEVO
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
    
    # Actualizar todos los campos (incluyendo descripcion)
    for key, value in periodo_in.model_dump().items():
        setattr(periodo, key, value)
    
    db.commit()
    db.refresh(periodo)
    return periodo