from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.productos import router as productos_router

app = FastAPI(
    title="Supermercado API — Examen",
    description="API REST para la gestión de productos del supermercado",
    version="1.0.0",
)

# Configuración de CORS para permitir solicitudes desde el frontend Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Sistema"])
def health() -> dict[str, str]:
    return {"estado": "ok", "aplicacion": "supermercado-api"}


app.include_router(productos_router)
