import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Emprendimiento, FiltrosEmprendimiento } from '../models/emprendimiento.model';

@Injectable({
  providedIn: 'root'
})
export class EmprendimientosService {
  private emprendimientosSubject = new BehaviorSubject<Emprendimiento[]>(this.getDatosIniciales());
  public emprendimientos$ = this.emprendimientosSubject.asObservable();

  constructor() {}

  obtenerEmprendimientos(): Observable<Emprendimiento[]> {
    return this.emprendimientos$;
  }

  obtenerEmprendimientosFiltrados(filtros: FiltrosEmprendimiento): Observable<Emprendimiento[]> {
    return this.emprendimientos$.pipe(
      map(emprendimientos => {
        let resultado = emprendimientos;

        if (filtros.soloActivos) {
          resultado = resultado.filter(emp => emp.activo);
        }

        if (filtros.soloDestacados) {
          resultado = resultado.filter(emp => emp.destacado);
        }

        if (filtros.categoria && filtros.categoria !== 'todas') {
          resultado = resultado.filter(emp =>
            emp.categoria.toLowerCase() === filtros.categoria!.toLowerCase()
          );
        }

        if (filtros.busqueda) {
          const busqueda = filtros.busqueda.toLowerCase();
          resultado = resultado.filter(emp =>
            emp.nombre.toLowerCase().includes(busqueda) ||
            emp.descripcion.toLowerCase().includes(busqueda) ||
            emp.servicios.some(servicio => servicio.toLowerCase().includes(busqueda)) ||
            emp.categoria.toLowerCase().includes(busqueda)
          );
        }

        if (filtros.ordenarPor) {
          resultado.sort((a, b) => {
            switch (filtros.ordenarPor) {
              case 'nombre':
                return a.nombre.localeCompare(b.nombre);
              case 'fecha':
                return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
              case 'rating':
                return (b.rating || 0) - (a.rating || 0);
              default:
                return 0;
            }
          });
        }

        return resultado;
      })
    );
  }

  obtenerCategorias(): string[] {
    const emprendimientos = this.emprendimientosSubject.value;
    const categorias = [...new Set(emprendimientos.map(emp => emp.categoria))];
    return categorias.sort();
  }

  obtenerEmprendimientoPorId(id: string): Observable<Emprendimiento | undefined> {
    return this.emprendimientos$.pipe(
      map(emprendimientos => emprendimientos.find(emp => emp.id === id))
    );
  }

  private getDatosIniciales(): Emprendimiento[] {
    return [
      {
        id: '1',
        nombre: 'Panadería Artesanal San José',
        descripcion: 'Panadería artesanal con productos frescos y tradicionales. Especializados en pan de campo y postres caseros.',
        descripcionCompleta: 'Somos una panadería familiar con más de 15 años de experiencia en la elaboración de productos artesanales. Utilizamos ingredientes naturales y recetas tradicionales para ofrecer el mejor sabor y calidad. Nuestros productos estrella incluyen pan de campo, croissants, tortas personalizadas y una amplia variedad de postres caseros.',
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
          '/assets/images/panaderia1.jpg',
          '/assets/images/panaderia2.jpg',
          '/assets/images/panaderia3.jpg'
        ],
        fechaCreacion: new Date('2024-01-15'),
        activo: true,
        rating: 4.8,
        precio: {
          min: 2000,
          max: 50000,
          moneda: 'COP'
        },
        servicios: ['Pan fresco', 'Postres caseros', 'Tortas por encargo', 'Desayunos', 'Catering'],
        destacado: true,
        redSocial: {
          facebook: 'https://facebook.com/panaderia.sanjose',
          instagram: '@panaderia_sanjose'
        },
        experiencia: '15 años',
        productos: ['Pan de campo', 'Croissants', 'Tortas', 'Galletas', 'Empanadas']
      },
      {
        id: '2',
        nombre: 'Taller de Costura Elena',
        descripcion: 'Servicios de costura, arreglos y confección de ropa personalizada.',
        descripcionCompleta: 'Taller especializado en costura y confección con más de 20 años de experiencia. Ofrecemos servicios de arreglos, confección de ropa personalizada, uniformes escolares y empresariales. Trabajamos con los mejores materiales y técnicas tradicionales para garantizar la calidad y durabilidad de nuestros productos.',
        categoria: 'Servicios',
        propietario: 'Elena Ramírez',
        contacto: {
          telefono: '+57 301 987 6543',
          email: 'costura.elena@email.com'
        },
        ubicacion: 'Torre B - Apartamento 507',
        horarios: 'Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 8:00 AM - 2:00 PM',
        imagenes: [
          '/assets/images/costura1.jpg',
          '/assets/images/costura2.jpg'
        ],
        fechaCreacion: new Date('2024-02-01'),
        activo: true,
        rating: 4.9,
        precio: {
          min: 10000,
          max: 200000,
          moneda: 'COP'
        },
        servicios: ['Arreglos de ropa', 'Confección personalizada', 'Bordados', 'Uniformes', 'Reparaciones'],
        destacado: false,
        experiencia: '20 años',
        productos: ['Uniformes escolares', 'Ropa formal', 'Vestidos de fiesta', 'Cortinas', 'Cojines']
      },
      {
        id: '3',
        nombre: 'FitLife Personal Training',
        descripcion: 'Entrenamiento personalizado y asesoría nutricional a domicilio.',
        descripcionCompleta: 'Servicio integral de entrenamiento personal y asesoría nutricional. Contamos con entrenadores certificados y nutricionistas profesionales. Ofrecemos planes personalizados adaptados a las necesidades y objetivos de cada cliente, con seguimiento constante y resultados garantizados.',
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
          '/assets/images/fitness1.jpg',
          '/assets/images/fitness2.jpg',
          '/assets/images/fitness3.jpg'
        ],
        fechaCreacion: new Date('2024-03-10'),
        activo: true,
        rating: 4.7,
        precio: {
          min: 50000,
          max: 300000,
          moneda: 'COP'
        },
        servicios: ['Entrenamiento personal', 'Asesoría nutricional', 'Rutinas online', 'Clases grupales', 'Evaluaciones físicas'],
        destacado: true,
        redSocial: {
          instagram: '@fitlife_training',
          website: 'https://fitlife-training.com'
        },
        experiencia: '8 años',
        productos: ['Planes de entrenamiento', 'Dietas personalizadas', 'Suplementos', 'Equipos de ejercicio']
      },
      {
        id: '4',
        nombre: 'Belleza Natural Spa',
        descripcion: 'Servicios de belleza y cuidado personal en la comodidad de tu hogar.',
        descripcionCompleta: 'Spa y centro de belleza móvil que lleva todos los servicios de cuidado personal hasta tu hogar. Contamos con profesionales certificados en tratamientos faciales, corporales, manicure, pedicure y masajes relajantes. Utilizamos productos naturales y orgánicos de la más alta calidad.',
        categoria: 'Belleza y Cuidado Personal',
        propietario: 'Ana Sofia López',
        contacto: {
          telefono: '+57 305 111 2222',
          whatsapp: '+57 305 111 2222',
          email: 'belleza.natural@email.com'
        },
        ubicacion: 'Torre A - Apartamento 203',
        horarios: 'Martes a Domingo: 9:00 AM - 7:00 PM',
        imagenes: [
          '/assets/images/spa1.jpg',
          '/assets/images/spa2.jpg'
        ],
        fechaCreacion: new Date('2024-01-20'),
        activo: true,
        rating: 4.6,
        precio: {
          min: 25000,
          max: 150000,
          moneda: 'COP'
        },
        servicios: ['Tratamientos faciales', 'Masajes relajantes', 'Manicure y pedicure', 'Depilación', 'Limpieza facial'],
        destacado: false,
        redSocial: {
          instagram: '@belleza_natural_spa',
          facebook: 'https://facebook.com/belleza.natural.spa'
        },
        experiencia: '12 años',
        productos: ['Productos naturales', 'Cremas faciales', 'Aceites esenciales', 'Mascarillas']
      }
    ];
  }
}
