from pydantic import BaseModel, Field, field_validator


class ProductoEntrada(BaseModel):
    """Modelo de entrada para crear o actualizar un producto con validaciones."""
    nombre: str = Field(..., min_length=1, description="Nombre del producto")
    categoria: str = Field(..., min_length=1, description="Categoría a la que pertenece el producto")
    precio: float = Field(..., gt=0, description="Precio unitario (debe ser mayor a 0)")
    cantidad: int = Field(..., ge=0, description="Cantidad disponible en inventario (mayor o igual a 0)")

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("El nombre no puede estar vacío ni contener solo espacios en blanco")
        return v.strip()

    @field_validator("categoria")
    @classmethod
    def validar_categoria(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("La categoría no puede estar vacía ni contener solo espacios en blanco")
        return v.strip()


class ProductoSalida(ProductoEntrada):
    """Modelo de salida para respuesta que incluye el identificador único."""
    id: int

