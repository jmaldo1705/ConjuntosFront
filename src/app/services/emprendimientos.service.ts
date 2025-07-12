
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Emprendimiento, FiltrosEmprendimiento } from '../models/emprendimiento.model';

export interface RespuestaEmprendimientos {
  emprendimientos: Emprendimiento[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmprendimientosService {
  private baseUrl = 'http://localhost:8080/api';
  private usarDatosMock = true; // Para desarrollo

  // BehaviorSubjects para mantener estado
  private emprendimientosSubject = new BehaviorSubject<Emprendimiento[]>([]);
  private categoriasSubject = new BehaviorSubject<string[]>([]);
  private cargandoSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public emprendimientos$ = this.emprendimientosSubject.asObservable();
  public categorias$ = this.categoriasSubject.asObservable();
  public cargando$ = this.cargandoSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los emprendimientos
   */
  obtenerEmprendimientos(filtros?: FiltrosEmprendimiento): Observable<RespuestaEmprendimientos> {
    console.log('Obteniendo emprendimientos con filtros:', filtros);

    if (this.usarDatosMock) {
      const mockResponse = this.getMockResponse();
      console.log('Retornando datos mock:', mockResponse);

      // Actualizar subjects para mantener consistencia
      this.emprendimientosSubject.next(mockResponse.emprendimientos);

      return of(mockResponse);
    }

    // Lógica del backend (cuando esté disponible)
    return this.http.get<RespuestaEmprendimientos>(`${this.baseUrl}/emprendimientos`)
      .pipe(
        map(response => {
          this.emprendimientosSubject.next(response.emprendimientos);
          return response;
        }),
        catchError(error => {
          console.error('Error al obtener emprendimientos:', error);
          const mockResponse = this.getMockResponse();
          this.emprendimientosSubject.next(mockResponse.emprendimientos);
          return of(mockResponse);
        })
      );
  }

  /**
   * Obtener categorías disponibles
   */
  obtenerCategorias(): Observable<string[]> {
    console.log('Obteniendo categorías');

    if (this.usarDatosMock) {
      const categorias = this.getCategoriasMock();
      console.log('Retornando categorías mock:', categorias);

      // Actualizar subject
      this.categoriasSubject.next(categorias);

      return of(categorias);
    }

    return this.http.get<string[]>(`${this.baseUrl}/emprendimientos/categorias`)
      .pipe(
        map(categorias => {
          this.categoriasSubject.next(categorias);
          return categorias;
        }),
        catchError(error => {
          console.error('Error al obtener categorías:', error);
          const mockCategorias = this.getCategoriasMock();
          this.categoriasSubject.next(mockCategorias);
          return of(mockCategorias);
        })
      );
  }

  /**
   * Obtener emprendimientos filtrados (simplificado)
   */
  obtenerEmprendimientosFiltrados(filtros: FiltrosEmprendimiento): Observable<Emprendimiento[]> {
    return this.obtenerEmprendimientos(filtros).pipe(
      map(response => response.emprendimientos)
    );
  }

  /**
   * Obtener categorías mock
   */
  private getCategoriasMock(): string[] {
    const emprendimientos = this.getDatosIniciales();
    const categorias = [...new Set(emprendimientos.map(emp => emp.categoria))];
    return categorias.sort();
  }

  /**
   * Respuesta mock para desarrollo
   */
  private getMockResponse(): RespuestaEmprendimientos {
    const emprendimientos = this.getDatosIniciales();
    return {
      emprendimientos,
      total: emprendimientos.length,
      pagina: 1,
      totalPaginas: 1
    };
  }

  /**
   * Datos iniciales simplificados
   */
  private getDatosIniciales(): Emprendimiento[] {
    return [
      {
        id: '1',
        nombre: 'Panadería Artesanal San José',
        descripcion: 'Panadería artesanal con productos frescos y tradicionales recién horneados.',
        descripcionCompleta: 'Somos una panadería familiar con más de 15 años de experiencia en la elaboración de pan artesanal, postres caseros y tortas personalizadas. Usamos ingredientes frescos y naturales para brindar la mejor calidad a nuestros clientes.',
        categoria: 'Alimentación',
        propietario: 'María González',
        contacto: {
          telefono: '+57 300 123 4567',
          email: 'panaderia.sanjose@email.com',
          whatsapp: '+57 300 123 4567'
        },
        ubicacion: 'Torre A - Apartamento 301',
        horarios: 'Lunes a Domingo: 6:00 AM - 8:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1517433456452-f9633a875fbc?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-01-15'),
        activo: true,
        rating: 4.8,
        precio: {
          min: 2000,
          max: 50000,
          moneda: 'COP'
        },
        servicios: ['Pan fresco', 'Postres caseros', 'Tortas por encargo', 'Desayunos'],
        destacado: true,
        redSocial: {
          facebook: 'https://facebook.com/panaderia.sanjose',
          instagram: '@panaderia_sanjose'
        },
        experiencia: '15 años',
        productos: ['Pan de campo', 'Croissants', 'Tortas', 'Pastelitos', 'Empanadas']
      },
      {
        id: '2',
        nombre: 'Taller de Costura Elena',
        descripcion: 'Servicios de costura profesional, arreglos y confección personalizada.',
        descripcionCompleta: 'Taller especializado en costura con 20 años de experiencia. Ofrecemos servicios de arreglos, confección de uniformes escolares, ropa formal y bordados personalizados. Trabajamos con los mejores materiales y técnicas profesionales.',
        categoria: 'Servicios',
        propietario: 'Elena Ramírez',
        contacto: {
          telefono: '+57 301 987 6543',
          email: 'costura.elena@email.com'
        },
        ubicacion: 'Torre B - Apartamento 507',
        horarios: 'Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 8:00 AM - 2:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1445205342-1b46dce7d665?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-02-01'),
        activo: true,
        rating: 4.9,
        precio: {
          min: 10000,
          max: 200000,
          moneda: 'COP'
        },
        servicios: ['Arreglos de ropa', 'Confección personalizada', 'Bordados', 'Uniformes'],
        destacado: false,
        experiencia: '20 años',
        productos: ['Uniformes escolares', 'Ropa formal', 'Vestidos', 'Camisas', 'Pantalones']
      },
      {
        id: '3',
        nombre: 'FitLife Personal Training',
        descripcion: 'Entrenamiento personalizado a domicilio con equipos profesionales.',
        descripcionCompleta: 'Servicio integral de entrenamiento personal con instructores certificados. Ofrecemos rutinas personalizadas, asesoría nutricional y seguimiento completo para alcanzar tus objetivos de fitness y salud.',
        categoria: 'Salud y Bienestar',
        propietario: 'Carlos Mendoza',
        contacto: {
          telefono: '+57 302 456 7890',
          whatsapp: '+57 302 456 7890',
          email: 'fitlife.training@email.com'
        },
        ubicacion: 'Torre C - Apartamento 805',
        horarios: 'Lunes a Sábado: 6:00 AM - 8:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-03-10'),
        activo: true,
        rating: 4.7,
        precio: {
          min: 50000,
          max: 300000,
          moneda: 'COP'
        },
        servicios: ['Entrenamiento personal', 'Asesoría nutricional', 'Rutinas online', 'Yoga'],
        destacado: true,
        redSocial: {
          instagram: '@fitlife_training'
        },
        experiencia: '8 años',
        productos: ['Planes de entrenamiento', 'Dietas personalizadas', 'Rutinas de ejercicio']
      },
      {
        id: '4',
        nombre: 'Belleza Natural Spa',
        descripcion: 'Servicios de belleza y relajación con productos naturales y orgánicos.',
        descripcionCompleta: 'Spa especializado en tratamientos de belleza con productos 100% naturales. Ofrecemos faciales, masajes relajantes, manicure, pedicure y tratamientos corporales en un ambiente tranquilo y profesional.',
        categoria: 'Belleza y Cuidado Personal',
        propietario: 'Ana Sofía Martínez',
        contacto: {
          telefono: '+57 305 789 1234',
          whatsapp: '+57 305 789 1234',
          email: 'bellezanatural.spa@email.com'
        },
        ubicacion: 'Torre D - Apartamento 203',
        horarios: 'Martes a Domingo: 9:00 AM - 7:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-02-20'),
        activo: true,
        rating: 4.6,
        precio: {
          min: 25000,
          max: 150000,
          moneda: 'COP'
        },
        servicios: ['Faciales', 'Masajes', 'Manicure', 'Pedicure', 'Tratamientos corporales'],
        destacado: false,
        redSocial: {
          instagram: '@bellezanatural_spa',
          facebook: 'https://facebook.com/bellezanatural.spa'
        },
        experiencia: '12 años',
        productos: ['Productos naturales', 'Cremas artesanales', 'Aceites esenciales']
      },
      {
        id: '5',
        nombre: 'TechRepair Solutions',
        descripcion: 'Reparación y mantenimiento de equipos electrónicos y celulares.',
        descripcionCompleta: 'Servicio técnico especializado en reparación de smartphones, tablets, computadores y electrodomésticos. Contamos con técnicos certificados y repuestos originales para garantizar la calidad de nuestros servicios.',
        categoria: 'Tecnología y Reparaciones',
        propietario: 'Luis Fernando Castro',
        contacto: {
          telefono: '+57 304 567 8901',
          whatsapp: '+57 304 567 8901',
          email: 'techrepair.solutions@email.com'
        },
        ubicacion: 'Torre E - Apartamento 412',
        horarios: 'Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 4:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-03-05'),
        activo: true,
        rating: 4.5,
        precio: {
          min: 15000,
          max: 400000,
          moneda: 'COP'
        },
        servicios: ['Reparación de celulares', 'Reparación de computadores', 'Mantenimiento', 'Instalación de software'],
        destacado: true,
        redSocial: {
          facebook: 'https://facebook.com/techrepair.solutions'
        },
        experiencia: '10 años',
        productos: ['Repuestos originales', 'Accesorios', 'Protectores de pantalla']
      },
      {
        id: '6',
        nombre: 'Jardín Vertical Eco',
        descripcion: 'Diseño y mantenimiento de jardines verticales y plantas ornamentales.',
        descripcionCompleta: 'Especialistas en diseño de jardines verticales, mantenimiento de plantas y creación de espacios verdes para apartamentos y balcones. Promovemos la vida sostenible y el contacto con la naturaleza.',
        categoria: 'Jardinería y Plantas',
        propietario: 'Patricia Herrera',
        contacto: {
          telefono: '+57 306 234 5678',
          whatsapp: '+57 306 234 5678',
          email: 'jardinvertical.eco@email.com'
        },
        ubicacion: 'Torre F - Apartamento 601',
        horarios: 'Lunes a Sábado: 7:00 AM - 5:00 PM',
        imagenes: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400&h=300&fit=crop'
        ],
        fechaCreacion: new Date('2024-01-30'),
        activo: true,
        rating: 4.8,
        precio: {
          min: 30000,
          max: 250000,
          moneda: 'COP'
        },
        servicios: ['Jardines verticales', 'Mantenimiento de plantas', 'Diseño de espacios', 'Asesoría en jardinería'],
        destacado: false,
        redSocial: {
          instagram: '@jardinvertical_eco'
        },
        experiencia: '7 años',
        productos: ['Plantas ornamentales', 'Sistemas de riego', 'Macetas decorativas', 'Fertilizantes orgánicos']
      }
    ];
  }
}
