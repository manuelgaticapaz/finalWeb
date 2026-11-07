"""Datos en memoria. Se reinician cuando se reinicia el servidor."""

productos: list[dict] = [
    {
        "id": 1,
        "nombre": "Arroz Blanco 1kg",
        "categoria": "Granos y Cereales",
        "precio": 12.50,
        "cantidad": 50,
    },
    {
        "id": 2,
        "nombre": "Aceite Vegetal 800ml",
        "categoria": "Abarrotes",
        "precio": 18.00,
        "cantidad": 35,
    },
    {
        "id": 3,
        "nombre": "Leche Entera 1L",
        "categoria": "Lácteos",
        "precio": 14.25,
        "cantidad": 40,
    },
]

siguiente_id: int = 4
