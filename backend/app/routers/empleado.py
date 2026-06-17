from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.empleado import Empleado
from app.models.planilla import Planilla
from app.schemas.empleado import (
    EmpleadoCreate,
    EmpleadoUpdate,
    EmpleadoResponse
)

router = APIRouter(
    prefix="/empleado",
    tags=["Empleado"]
)

# ==========================
# CONEXIÓN DB
# ==========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================
# CREAR EMPLEADO
# ==========================
@router.post("/", response_model=EmpleadoResponse)
def crear_empleado(
    empleado_in: EmpleadoCreate,
    db: Session = Depends(get_db)
):
    existente = db.query(Empleado).filter(
        Empleado.dui == empleado_in.dui
    ).first()

    if existente:
        raise HTTPException(
            status_code=400,
            detail="El DUI ya está registrado"
        )

    nuevo = Empleado(**empleado_in.model_dump())

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


# ==========================
# LISTAR EMPLEADOS
# ==========================
@router.get("/", response_model=List[EmpleadoResponse])
def listar_empleados(db: Session = Depends(get_db)):
    return db.query(Empleado).all()


# ==========================
# OBTENER EMPLEADO
# ==========================
@router.get("/{id}", response_model=EmpleadoResponse)
def obtener_empleado(
    id: int,
    db: Session = Depends(get_db)
):
    empleado = db.query(Empleado).filter(
        Empleado.id == id
    ).first()

    if not empleado:
        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return empleado


# ==========================
# ACTUALIZAR EMPLEADO
# ==========================
@router.put("/{id}", response_model=EmpleadoResponse)
def actualizar_empleado(
    id: int,
    empleado_in: EmpleadoUpdate,
    db: Session = Depends(get_db)
):
    empleado = db.query(Empleado).filter(
        Empleado.id == id
    ).first()

    if not empleado:
        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    # Verificar DUI repetido
    existente = db.query(Empleado).filter(
        Empleado.dui == empleado_in.dui,
        Empleado.id != id
    ).first()

    if existente:
        raise HTTPException(
            status_code=400,
            detail="El DUI ya está registrado por otro empleado"
        )

    empleado.nombre = empleado_in.nombre
    empleado.dui = empleado_in.dui
    empleado.area = empleado_in.area
    empleado.puesto = empleado_in.puesto
    empleado.salario_mensual = empleado_in.salario_mensual
    empleado.fecha_ingreso = empleado_in.fecha_ingreso

    db.commit()
    db.refresh(empleado)

    return empleado


# ==========================
# ELIMINAR EMPLEADO
# ==========================
@router.delete("/{id}")
def eliminar_empleado(
    id: int,
    db: Session = Depends(get_db)
):
    empleado = db.query(Empleado).filter(
        Empleado.id == id
    ).first()

    if not empleado:
        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    # Verificar si tiene planillas
    planilla = db.query(Planilla).filter(
        Planilla.empleado_id == id
    ).first()

    if planilla:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el empleado porque tiene planillas asociadas"
        )

    db.delete(empleado)
    db.commit()

    return {
        "ok": True,
        "mensaje": "Empleado eliminado correctamente"
    }