from fastapi import APIRouter, HTTPException, status

from app.models import ProductoEntrada, ProductoSalida
from app import store

router = APIRouter(prefix="/api/productos", tags=["Productos"])


@router.get("", response_model=list[ProductoSalida])
def listar_productos():
    """Retorna todos los productos almacenados en memoria."""
    return store.productos


@router.get("/{producto_id}", response_model=ProductoSalida)
def obtener_producto(producto_id: int):
    """Obtiene un producto específico por su identificador."""
    for p in store.productos:
        if p["id"] == producto_id:
            return p
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Producto con ID {producto_id} no encontrado",
    )


@router.post("", response_model=ProductoSalida, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: ProductoEntrada):
    """Crea un nuevo producto asignándole un ID único autoincremental."""
    nuevo_producto = {
        "id": store.siguiente_id,
        "nombre": producto.nombre,
        "categoria": producto.categoria,
        "precio": producto.precio,
        "cantidad": producto.cantidad,
    }
    store.productos.append(nuevo_producto)
    store.siguiente_id += 1
    return nuevo_producto


@router.put("/{producto_id}", response_model=ProductoSalida)
def actualizar_producto(producto_id: int, producto: ProductoEntrada):
    """Actualiza los datos de un producto existente."""
    for idx, p in enumerate(store.productos):
        if p["id"] == producto_id:
            producto_actualizado = {
                "id": producto_id,
                "nombre": producto.nombre,
                "categoria": producto.categoria,
                "precio": producto.precio,
                "cantidad": producto.cantidad,
            }
            store.productos[idx] = producto_actualizado
            return producto_actualizado

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Producto con ID {producto_id} no encontrado",
    )


@router.delete("/{producto_id}", status_code=status.HTTP_200_OK)
def eliminar_producto(producto_id: int):
    """Elimina un producto del almacenamiento en memoria."""
    for idx, p in enumerate(store.productos):
        if p["id"] == producto_id:
            producto_eliminado = store.productos.pop(idx)
            return {
                "mensaje": "Producto eliminado exitosamente",
                "id": producto_eliminado["id"],
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Producto con ID {producto_id} no encontrado",
    )
