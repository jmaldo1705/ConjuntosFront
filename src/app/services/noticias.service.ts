
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import type { Noticia } from '../models/noticia.model';
import type { ConfiguracionSistema, Conjunto, FiltrosNoticiasConjunto } from '../models/shared.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private apiUrl = 'http://localhost:8080/api';

  // Configuraciones de ejemplo para múltiples conjuntos
  private configuracionesSistema: ConfiguracionSistema[] = [
    {
      id: 'conjunto-las-flores',
      nombreConjunto: 'Conjunto Residencial Las Flores',
      direccion: 'Carrera 123 #45-67',
      telefono: '+57 1 234 5678',
      email: 'administracion@lasflores.com'
    },
    {
      id: 'conjunto-los-pinos',
      nombreConjunto: 'Conjunto Residencial Los Pinos',
      direccion: 'Calle 456 #78-90',
      telefono: '+57 1 345 6789',
      email: 'administracion@lospinos.com'
    },
    {
      id: 'conjunto-villa-sol',
      nombreConjunto: 'Conjunto Villa del Sol',
      direccion: 'Avenida 789 #12-34',
      telefono: '+57 1 456 7890',
      email: 'administracion@villasol.com'
    }
  ];

  private usarDatosEjemplo = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener el conjunto del usuario actual de forma segura
  private getConjuntoUsuarioActual(): string {
    try {
      const user = this.authService.getCurrentUserSync();
      return user?.conjuntoId || 'conjunto-las-flores'; // fallback seguro
    } catch (error) {
      console.error('Error al obtener conjunto del usuario:', error);
      return 'conjunto-las-flores'; // fallback en caso de error
    }
  }

  // Obtener todas las noticias del conjunto del usuario autenticado
  getNoticias(): Observable<Noticia[]> {
    const conjuntoId = this.getConjuntoUsuarioActual();

    if (this.usarDatosEjemplo) {
      return of(this.getNoticiasEjemplo(conjuntoId)).pipe(
        map(noticias => noticias.sort((a, b) =>
          new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
        ))
      );
    }

    return this.http.get<Noticia[]>(`${this.apiUrl}/noticias`, {
      params: { conjuntoId }
    }).pipe(
      map(noticias => noticias.sort((a, b) =>
        new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
      )),
      catchError(error => {
        console.error('Error al cargar noticias:', error);
        return of(this.getNoticiasEjemplo(conjuntoId));
      })
    );
  }

  // NUEVO MÉTODO: Obtener todas las noticias de todos los conjuntos
  getNoticiasMulticonjunto(): Observable<Noticia[]> {
    if (this.usarDatosEjemplo) {
      // Obtener todas las noticias sin filtrar por conjunto
      return of(this.getNoticiasEjemplo()).pipe(
        map(noticias => noticias.sort((a, b) =>
          new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
        ))
      );
    }

    return this.http.get<Noticia[]>(`${this.apiUrl}/noticias/multiconjunto`).pipe(
      map(noticias => noticias.sort((a, b) =>
        new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
      )),
      catchError(error => {
        console.error('Error al cargar noticias multiconjunto:', error);
        return of(this.getNoticiasEjemplo());
      })
    );
  }

  // Obtener noticias por categoría
  getNoticiasPorCategoria(categoria: string): Observable<Noticia[]> {
    return this.getNoticias().pipe(
      map(noticias =>
        categoria === 'Todas'
          ? noticias
          : noticias.filter(noticia => noticia.categoria === categoria)
      )
    );
  }

  // Obtener noticias por prioridad
  getNoticiasPorPrioridad(prioridad: string): Observable<Noticia[]> {
    return this.getNoticias().pipe(
      map(noticias => noticias.filter(noticia => noticia.prioridad === prioridad))
    );
  }

  // Filtrar noticias con filtros específicos
  filtrarNoticias(
    noticias: Noticia[],
    filtros: FiltrosNoticiasConjunto
  ): Noticia[] {
    return noticias.filter(noticia => {
      if (filtros.categoria && filtros.categoria !== 'Todas' && noticia.categoria !== filtros.categoria) {
        return false;
      }

      if (filtros.prioridad && filtros.prioridad !== 'Todas' && noticia.prioridad !== filtros.prioridad) {
        return false;
      }

      if (filtros.alcance && filtros.alcance !== 'Todos' && noticia.alcance !== filtros.alcance) {
        return false;
      }

      if (filtros.ubicacion && filtros.ubicacion !== 'Todas' && noticia.ubicacion !== filtros.ubicacion) {
        return false;
      }

      if (filtros.fechaDesde && new Date(noticia.fechaPublicacion) < filtros.fechaDesde) {
        return false;
      }

      if (filtros.fechaHasta && new Date(noticia.fechaPublicacion) > filtros.fechaHasta) {
        return false;
      }

      return true;
    });
  }

  // NUEVO MÉTODO: Filtrar noticias multiconjunto con filtro adicional de conjunto
  filtrarNoticiasMulticonjunto(
    noticias: Noticia[],
    filtros: FiltrosNoticiasConjunto & { conjuntoId?: string }
  ): Noticia[] {
    let noticiasFiltradasBase = this.filtrarNoticias(noticias, filtros);

    // Filtro adicional por conjunto
    if (filtros.conjuntoId && filtros.conjuntoId !== 'Todos') {
      noticiasFiltradasBase = noticiasFiltradasBase.filter(noticia =>
        noticia.conjuntoId === filtros.conjuntoId
      );
    }

    return noticiasFiltradasBase;
  }

  // Obtener configuración del conjunto del usuario actual
  getConfiguracionSistema(): ConfiguracionSistema | null {
    const conjuntoId = this.getConjuntoUsuarioActual();
    return this.configuracionesSistema.find(config => config.id === conjuntoId) || null;
  }

  // Obtener todas las configuraciones
  getAllConfiguracionesSistema(): ConfiguracionSistema[] {
    return this.configuracionesSistema;
  }

  // Obtener lista de conjuntos disponibles
  getConjuntos(): Observable<Conjunto[]> {
    const conjuntos: Conjunto[] = this.configuracionesSistema.map(config => ({
      id: config.id,
      nombre: config.nombreConjunto,
      direccion: config.direccion,
      telefono: config.telefono,
      email: config.email,
      sitioWeb: config.sitioWeb,
      activo: true,
      fechaCreacion: new Date()
    }));

    if (this.usarDatosEjemplo) {
      return of(conjuntos);
    }

    return this.http.get<Conjunto[]>(`${this.apiUrl}/conjuntos`).pipe(
      catchError(error => {
        console.error('Error al cargar conjuntos:', error);
        return of(conjuntos);
      })
    );
  }

  toggleDatosEjemplo(usar: boolean) {
    this.usarDatosEjemplo = usar;
  }

  // Datos de ejemplo para desarrollo
  private getNoticiasEjemplo(conjuntoId?: string): Noticia[] {
    const todasLasNoticias: Noticia[] = [
      {
        id: 1,
        titulo: 'Mantenimiento de la Piscina',
        fecha: '5 de junio, 2025',
        resumen: 'Se realizará mantenimiento de la piscina del conjunto. Estará cerrada durante dos días para limpieza profunda y ajustes del sistema de filtración.',
        contenido: 'Estimados residentes, les informamos que se realizará el mantenimiento semestral de la piscina...',
        imagen: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Mantenimiento',
        ubicacion: 'Zona de Piscina',
        autor: 'Administración',
        fechaPublicacion: new Date('2025-06-05'),
        prioridad: 'media',
        alcance: 'general',
        etiquetas: ['piscina', 'mantenimiento', 'zona-comun'],
        conjuntoId: 'conjunto-las-flores'
      },
      {
        id: 2,
        titulo: 'Asamblea General Ordinaria',
        fecha: '1 de junio, 2025',
        resumen: 'Convocatoria a la Asamblea General Ordinaria de Copropietarios para aprobación del presupuesto anual.',
        contenido: 'Se convoca a todos los copropietarios a la Asamblea General Ordinaria...',
        imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Administración',
        ubicacion: 'Salón Comunal',
        autor: 'Consejo de Administración',
        fechaPublicacion: new Date('2025-06-01'),
        prioridad: 'alta',
        alcance: 'general',
        etiquetas: ['asamblea', 'presupuesto', 'obligatorio'],
        conjuntoId: 'conjunto-las-flores'
      },
      {
        id: 10,
        titulo: 'Renovación del Parque Infantil',
        fecha: '8 de junio, 2025',
        resumen: 'Instalación de nuevos juegos infantiles y área de ejercicios para adultos mayores.',
        contenido: 'Nos complace anunciar la renovación completa del parque infantil...',
        imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Mantenimiento',
        ubicacion: 'Parque Central',
        autor: 'Administración Los Pinos',
        fechaPublicacion: new Date('2025-06-08'),
        prioridad: 'media',
        alcance: 'general',
        etiquetas: ['parque', 'infantil', 'renovacion'],
        conjuntoId: 'conjunto-los-pinos'
      },
      {
        id: 20,
        titulo: 'Festival de Verano',
        fecha: '20 de junio, 2025',
        resumen: 'Gran festival de verano con actividades para toda la familia. Música, juegos y comida.',
        contenido: 'Los invitamos al gran festival de verano que se realizará...',
        imagen: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Eventos',
        ubicacion: 'Zona Social',
        autor: 'Comité Social Villa del Sol',
        fechaPublicacion: new Date('2025-06-20'),
        prioridad: 'baja',
        alcance: 'general',
        etiquetas: ['festival', 'verano', 'familia'],
        conjuntoId: 'conjunto-villa-sol'
      },
      // Agregar más noticias de ejemplo para otros conjuntos
      {
        id: 3,
        titulo: 'Actualización del Sistema de Seguridad',
        fecha: '7 de junio, 2025',
        resumen: 'Instalación de nuevas cámaras de seguridad y actualización del sistema de control de acceso.',
        contenido: 'Como parte de nuestro compromiso con la seguridad...',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        categoria: 'Seguridad',
        ubicacion: 'Entrada Principal',
        autor: 'Administración Las Flores',
        fechaPublicacion: new Date('2025-06-07'),
        prioridad: 'alta',
        alcance: 'general',
        etiquetas: ['seguridad', 'camaras', 'control-acceso'],
        conjuntoId: 'conjunto-las-flores'
      },
      {
        id: 11,
        titulo: 'Corte Programado de Agua',
        fecha: '10 de junio, 2025',
        resumen: 'Corte programado del suministro de agua para reparación de tuberías principales.',
        contenido: 'Informamos a todos los residentes que se realizará...',
        categoria: 'Mantenimiento',
        ubicacion: 'Todo el conjunto',
        autor: 'Administración Los Pinos',
        fechaPublicacion: new Date('2025-06-10'),
        prioridad: 'alta',
        alcance: 'general',
        etiquetas: ['agua', 'corte', 'mantenimiento'],
        conjuntoId: 'conjunto-los-pinos'
      },
      {
        id: 21,
        titulo: 'Nuevos Horarios de Gimnasio',
        fecha: '12 de junio, 2025',
        resumen: 'Ampliación de horarios del gimnasio y nuevas clases grupales disponibles.',
        contenido: 'Nos complace anunciar la ampliación de horarios...',
        categoria: 'Eventos',
        ubicacion: 'Gimnasio',
        autor: 'Comité Deportivo Villa del Sol',
        fechaPublicacion: new Date('2025-06-12'),
        prioridad: 'baja',
        alcance: 'general',
        etiquetas: ['gimnasio', 'horarios', 'clases'],
        conjuntoId: 'conjunto-villa-sol'
      }
    ];

    if (!conjuntoId) {
      return todasLasNoticias;
    }

    return todasLasNoticias.filter(noticia => noticia.conjuntoId === conjuntoId);
  }
}
