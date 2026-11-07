/**
 * Interfaz y tipos para representar un Producto en la aplicación.
 */
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

export type NuevoProducto = Omit<Producto, 'id'>;
