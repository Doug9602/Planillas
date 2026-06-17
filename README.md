# Planillas Texaco

Sistema de control de planillas para gasolinera Texaco (demo).  
Backend: FastAPI (Python) | Frontend: React | Base de datos: PostgreSQL
---

## Requisitos previos

- Python 3.10+
- Node.js 18+
- PostgreSQL (local)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Doug9602/Planillas.git
cd Planillas
2. Crear la base de datos
Accede a PostgreSQL y crea la base de datos:

sql
CREATE DATABASE planillas;

3. Configurar variables de entorno (Backend)
bash
cd backend
cp .env.example .env
Edita .env con tus credenciales:

env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/planillas
SECRET_KEY=mi-clave-secreta-para-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

4. Configurar variables de entorno (Frontend)
bash
cd ../frontend
cp .env.example .env
Ajusta REACT_APP_API_URL si es necesario.

5. Instalar dependencias y ejecutar el Backend
bash
cd ../backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt   
uvicorn app.main:app --reload --port 8000

6. Ejecutar el Frontend
bash
cd ../frontend
npm install
npm start
