import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApartamentosService, RespuestaApartamentos, ConjuntoInfo } from '../services/apartamentos.service';

export interface DatosApartamentos {
  apartamentos: RespuestaApartamentos;
  conjuntos: ConjuntoInfo[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApartamentosResolver implements Resolve<DatosApartamentos> {
  private apartamentosService = inject(ApartamentosService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DatosApartamentos> {
    // Cargar apartamentos y conjuntos en paralelo
    return forkJoin({
      apartamentos: this.apartamentosService.obtenerApartamentos().pipe(
        catchError(error => {
          console.error('Error al cargar apartamentos:', error);
          return of({
            apartamentos: [],
            total: 0,
            pagina: 1,
            totalPaginas: 0,
            conjuntos: []
          } as RespuestaApartamentos);
        })
      ),
      conjuntos: this.apartamentosService.obtenerConjuntosCompletos().pipe(
        catchError(error => {
          console.error('Error al cargar conjuntos:', error);
          return of([] as ConjuntoInfo[]);
        })
      )
    }).pipe(
      map(({ apartamentos, conjuntos }) => ({
        apartamentos,
        conjuntos,
        error: undefined
      })),
      catchError(error => {
        console.error('Error general en resolver:', error);
        return of({
          apartamentos: {
            apartamentos: [],
            total: 0,
            pagina: 1,
            totalPaginas: 0,
            conjuntos: []
          } as RespuestaApartamentos,
          conjuntos: [] as ConjuntoInfo[],
          error: 'Error al cargar los datos. Por favor, intenta nuevamente.'
        });
      })
    );
  }
}
