import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmprendimientosService } from '../services/emprendimientos.service';
import { Emprendimiento } from '../models/emprendimiento.model';

export interface RespuestaEmprendimientos {
  emprendimientos: Emprendimiento[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface DatosEmprendimientos {
  emprendimientos: RespuestaEmprendimientos;
  categorias: string[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmprendimientosResolver implements Resolve<DatosEmprendimientos> {
  private emprendimientosService = inject(EmprendimientosService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DatosEmprendimientos> {
    // Cargar emprendimientos y categorías en paralelo
    return forkJoin({
      emprendimientos: this.emprendimientosService.obtenerEmprendimientos().pipe(
        // Aquí está la corrección: el servicio ya devuelve RespuestaEmprendimientos
        catchError(error => {
          console.error('Error al cargar emprendimientos:', error);
          return of({
            emprendimientos: [],
            total: 0,
            pagina: 1,
            totalPaginas: 0
          } as RespuestaEmprendimientos);
        })
      ),
      categorias: this.emprendimientosService.obtenerCategorias().pipe(
        catchError(error => {
          console.error('Error al cargar categorías:', error);
          return of([] as string[]);
        })
      )
    }).pipe(
      map(({ emprendimientos, categorias }) => ({
        emprendimientos,
        categorias,
        error: undefined
      })),
      catchError(error => {
        console.error('Error general en resolver:', error);
        return of({
          emprendimientos: {
            emprendimientos: [],
            total: 0,
            pagina: 1,
            totalPaginas: 0
          } as RespuestaEmprendimientos,
          categorias: [] as string[],
          error: 'Error al cargar los datos. Por favor, intenta nuevamente.'
        });
      })
    );
  }
}
