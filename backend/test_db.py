from sqlalchemy import create_engine, text
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Conexión exitosa a PostgreSQL - Resultado:", result.fetchone())
except Exception as e:
    print("❌ Error de conexión:", e)