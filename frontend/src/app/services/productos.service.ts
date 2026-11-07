import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto, NuevoProducto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/productos';

  
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.procesarError(error, 'obtener los productos'))
    );
  }

  agregar(nuevo: NuevoProducto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, nuevo).pipe(
      catchError((error: HttpErrorResponse) => this.procesarError(error, 'registrar el nuevo producto'))
    );
  }

  
  eliminar(id: number): Observable<{ mensaje: string; id: number }> {
    return this.http.delete<{ mensaje: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.procesarError(error, `eliminar el producto con ID ${id}`))
    );
  }

  private procesarError(error: HttpErrorResponse, accion: string): Observable<never> {
    let mensajeUsuario = `Error al ${accion}.`;

    if (error.status === 0) {
      mensajeUsuario = `No se pudo conectar con la API de FastAPI (${this.apiUrl}). Verifica que el servidor backend esté en ejecución.`;
    } else if (error.error && typeof error.error === 'object' && error.error.detail) {
      
      if (typeof error.error.detail === 'string') {
        mensajeUsuario = error.error.detail;
      } else if (Array.isArray(error.error.detail)) {
        mensajeUsuario = error.error.detail
          .map((item: any) => item.msg || JSON.stringify(item))
          .join('; ');
      }
    } else if (error.status === 404) {
      mensajeUsuario = `El producto no fue encontrado en el servidor (404 Not Found).`;
    } else if (error.status >= 500) {
      mensajeUsuario = `Error interno en el servidor backend (Código ${error.status}).`;
    } else if (error.message) {
      mensajeUsuario = error.message;
    }

    console.error(`[ProductosService] Error al ${accion}:`, error);
    return throwError(() => new Error(mensajeUsuario));
  }
}
