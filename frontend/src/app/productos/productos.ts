import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, NuevoProducto } from '../models/producto';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  nuevoProducto: NuevoProducto = {
    nombre: '',
    categoria: '',
    precio: 0,
    cantidad: 0,
  };

  mensajeError: string = '';
  mensajeExito: string = '';
  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarProductos();
  }

  
  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.productosService.listar().subscribe({
      next: (lista) => {
        this.productos = lista;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.mensajeError = err.message || 'No fue posible cargar los productos desde el servidor.';
        this.productos = [];
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  guardarProducto(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.nuevoProducto.nombre || !this.nuevoProducto.nombre.trim()) {
      this.mensajeError = 'El nombre del producto es obligatorio.';
      return;
    }

    if (!this.nuevoProducto.categoria || !this.nuevoProducto.categoria.trim()) {
      this.mensajeError = 'La categoría es obligatoria.';
      return;
    }

    const precioNum = Number(this.nuevoProducto.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      this.mensajeError = 'El precio debe ser un número mayor a 0.';
      return;
    }

    const cantidadNum = Number(this.nuevoProducto.cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      this.mensajeError = 'La cantidad debe ser igual o mayor a 0.';
      return;
    }

    const productoAEnviar: NuevoProducto = {
      nombre: this.nuevoProducto.nombre.trim(),
      categoria: this.nuevoProducto.categoria.trim(),
      precio: precioNum,
      cantidad: cantidadNum,
    };

    this.cargando = true;
    this.productosService.agregar(productoAEnviar).subscribe({
      next: (creado) => {
        this.mensajeExito = `Producto "${creado.nombre}" registrado con éxito en el servidor (ID: ${creado.id}).`;
        this.limpiarFormulario();
        this.cargarProductos();
      },
      error: (err: Error) => {
        this.mensajeError = err.message || 'Ocurrió un error al registrar el producto en el servidor.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }


  eliminarProducto(id: number): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    this.productosService.eliminar(id).subscribe({
      next: (respuesta) => {
        this.mensajeExito = respuesta?.mensaje || `Producto con ID ${id} eliminado con éxito del servidor.`;
        this.cargarProductos();
      },
      error: (err: Error) => {
        this.mensajeError = err.message || 'Ocurrió un error al eliminar el producto del servidor.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  limpiarFormulario(): void {
    this.nuevoProducto = {
      nombre: '',
      categoria: '',
      precio: 0,
      cantidad: 0,
    };
  }
}

export { Productos as ProductoComponent };
