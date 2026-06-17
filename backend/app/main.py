 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import Empleado, Periodo, Planilla
from app.routers import empleado_router, periodo_router, planilla_router

# Crear las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Planillas Texaco", version="1.0.0")

# Configurar CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(empleado_router)
app.include_router(periodo_router)
app.include_router(planilla_router)

@app.get("/")
def raiz():
    return {"mensaje": "API Planillas Texaco funcionando correctamente"}