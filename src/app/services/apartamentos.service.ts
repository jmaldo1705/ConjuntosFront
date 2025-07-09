import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Apartamento {
  id: number;
  tipo: 'venta' | 'arriendo';
  titulo: string;
  precio: number;
  habitaciones: number;
  banos: number;
  area: number;
  piso: number;
  torre: string;
  apartamento: string;
  conjunto: string;
  descripcion: string;
  caracteristicas: string[];
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface FiltrosApartamentos {
  tipo?: 'venta' | 'arriendo' | 'todos';
  conjunto?: string;
  habitaciones?: number;
  precioMin?: number;
  precioMax?: number;
  disponible?: boolean;
  destacado?: boolean;
  busqueda?: string;
}

export interface RespuestaApartamentos {
  apartamentos: Apartamento[];
  total: number;
  pagina: number;
  totalPaginas: number;
  conjuntos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApartamentosService {
  private readonly API_URL = 'http://localhost:8080/api';
  private apartamentosSubject = new BehaviorSubject<Apartamento[]>([]);
  private conjuntosSubject = new BehaviorSubject<string[]>([]);
  private cargandoSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public apartamentos$ = this.apartamentosSubject.asObservable();
  public conjuntos$ = this.conjuntosSubject.asObservable();
  public cargando$ = this.cargandoSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los apartamentos con filtros opcionales
   */
  obtenerApartamentos(filtros: FiltrosApartamentos = {}): Observable<RespuestaApartamentos> {
    this.cargandoSubject.next(true);

    let params = new HttpParams();

    // Aplicar filtros
    if (filtros.tipo && filtros.tipo !== 'todos') {
      params = params.set('tipo', filtros.tipo);
    }
    if (filtros.conjunto) {
      params = params.set('conjunto', filtros.conjunto);
    }
    if (filtros.habitaciones) {
      params = params.set('habitaciones', filtros.habitaciones.toString());
    }
    if (filtros.precioMin) {
      params = params.set('precioMin', filtros.precioMin.toString());
    }
    if (filtros.precioMax) {
      params = params.set('precioMax', filtros.precioMax.toString());
    }
    if (filtros.disponible !== undefined) {
      params = params.set('disponible', filtros.disponible.toString());
    }
    if (filtros.destacado !== undefined) {
      params = params.set('destacado', filtros.destacado.toString());
    }
    if (filtros.busqueda) {
      params = params.set('busqueda', filtros.busqueda);
    }

    return this.http.get<RespuestaApartamentos>(`${this.API_URL}/apartamentos`, { params })
      .pipe(
        map(response => {
          this.apartamentosSubject.next(response.apartamentos);
          this.conjuntosSubject.next(response.conjuntos);
          this.cargandoSubject.next(false);
          return response;
        }),
        catchError(error => {
          this.cargandoSubject.next(false);
          console.error('Error al obtener apartamentos:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener apartamento por ID
   */
  obtenerApartamentoPorId(id: number): Observable<Apartamento> {
    this.cargandoSubject.next(true);

    return this.http.get<Apartamento>(`${this.API_URL}/apartamentos/${id}`)
      .pipe(
        map(apartamento => {
          this.cargandoSubject.next(false);
          return apartamento;
        }),
        catchError(error => {
          this.cargandoSubject.next(false);
          console.error('Error al obtener apartamento:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener apartamentos destacados
   */
  obtenerApartamentosDestacados(): Observable<Apartamento[]> {
    return this.obtenerApartamentos({ destacado: true })
      .pipe(
        map(response => response.apartamentos)
      );
  }

  /**
   * Obtener conjuntos disponibles
   */
  obtenerConjuntos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/apartamentos/conjuntos`)
      .pipe(
        map(conjuntos => {
          this.conjuntosSubject.next(conjuntos);
          return conjuntos;
        }),
        catchError(error => {
          console.error('Error al obtener conjuntos:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Crear solicitud de información para un apartamento
   */
  solicitarInformacion(apartamentoId: number, datos: {
    nombre: string;
    telefono: string;
    email: string;
    mensaje?: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/apartamentos/${apartamentoId}/solicitar-info`, datos)
      .pipe(
        catchError(error => {
          console.error('Error al solicitar información:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Programar visita a un apartamento
   */
  programarVisita(apartamentoId: number, datos: {
    nombre: string;
    telefono: string;
    email: string;
    fechaPreferida: string;
    horaPreferida: string;
    mensaje?: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/apartamentos/${apartamentoId}/programar-visita`, datos)
      .pipe(
        catchError(error => {
          console.error('Error al programar visita:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener estadísticas de apartamentos
   */
  obtenerEstadisticas(): Observable<{
    totalApartamentos: number;
    apartamentosVenta: number;
    apartamentosArriendo: number;
    apartamentosDisponibles: number;
    apartamentosDestacados: number;
  }> {
    return this.http.get<any>(`${this.API_URL}/apartamentos/estadisticas`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener estadísticas:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Buscar apartamentos por texto
   */
  buscarApartamentos(termino: string): Observable<Apartamento[]> {
    if (!termino.trim()) {
      return this.obtenerApartamentos().pipe(
        map(response => response.apartamentos)
      );
    }

    return this.obtenerApartamentos({ busqueda: termino })
      .pipe(
        map(response => response.apartamentos)
      );
  }

  /**
   * Limpiar datos del servicio
   */
  limpiarDatos(): void {
    this.apartamentosSubject.next([]);
    this.conjuntosSubject.next([]);
    this.cargandoSubject.next(false);
  }
}
