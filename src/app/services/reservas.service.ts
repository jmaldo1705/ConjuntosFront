
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ZonaComun, Reserva, HorarioZona } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservasSubject = new BehaviorSubject<Reserva[]>([]);
  public reservas$ = this.reservasSubject.asObservable();

  private zonasComunes: ZonaComun[] = [
    {
      id: 1,
      nombre: 'Salón Social',
      descripcion: 'Amplio salón perfecto para eventos, reuniones y celebraciones familiares con capacidad para 50 personas.',
      capacidad: 50,
      icono: '🏛️',
      color: 'from-purple-500 to-pink-500',
      tarifa: 120000,
      disponible: true,
      horarios: [
        { id: 'salon-mañana', nombre: 'Mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true, precio: 120000 },
        { id: 'salon-tarde', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true, precio: 120000 },
        { id: 'salon-noche', nombre: 'Noche', horaInicio: '19:00', horaFin: '23:00', disponible: true, precio: 150000 },
        { id: 'salon-completo', nombre: 'Día Completo', horaInicio: '08:00', horaFin: '23:00', disponible: true, precio: 350000 }
      ]
    },
    {
      id: 2,
      nombre: 'Piscina',
      descripcion: 'Piscina climatizada con área de recreación, zona de descanso y jacuzzi para 20 personas.',
      capacidad: 20,
      icono: '🏊‍♂️',
      color: 'from-blue-500 to-cyan-500',
      tarifa: 80000,
      disponible: true,
      horarios: [
        { id: 'piscina-mañana1', nombre: 'Primera Mañana', horaInicio: '06:00', horaFin: '10:00', disponible: true, precio: 80000 },
        { id: 'piscina-mañana2', nombre: 'Segunda Mañana', horaInicio: '10:00', horaFin: '14:00', disponible: true, precio: 80000 },
        { id: 'piscina-tarde', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true, precio: 90000 },
        { id: 'piscina-noche', nombre: 'Noche', horaInicio: '18:00', horaFin: '22:00', disponible: true, precio: 100000 }
      ]
    },
    {
      id: 3,
      nombre: 'Cancha Múltiple',
      descripcion: 'Cancha deportiva adaptada para fútbol, baloncesto, voleibol y otros deportes.',
      capacidad: 22,
      icono: '⚽',
      color: 'from-green-500 to-emerald-500',
      tarifa: 60000,
      disponible: true,
      horarios: [
        { id: 'cancha-mañana', nombre: 'Mañana', horaInicio: '06:00', horaFin: '12:00', disponible: true, precio: 60000 },
        { id: 'cancha-tarde', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true, precio: 60000 },
        { id: 'cancha-noche', nombre: 'Noche', horaInicio: '18:00', horaFin: '22:00', disponible: true, precio: 70000 }
      ]
    },
    {
      id: 4,
      nombre: 'Zona BBQ',
      descripcion: 'Área de parrillas con mesas, zona verde y todo lo necesario para asados familiares.',
      capacidad: 30,
      icono: '🔥',
      color: 'from-orange-500 to-red-500',
      tarifa: 90000,
      disponible: true,
      horarios: [
        { id: 'bbq-almuerzo', nombre: 'Almuerzo', horaInicio: '11:00', horaFin: '15:00', disponible: true, precio: 90000 },
        { id: 'bbq-tarde', nombre: 'Tarde', horaInicio: '15:00', horaFin: '19:00', disponible: true, precio: 90000 },
        { id: 'bbq-noche', nombre: 'Noche', horaInicio: '19:00', horaFin: '23:00', disponible: true, precio: 100000 }
      ]
    },
    {
      id: 5,
      nombre: 'Sala de Juntas',
      descripcion: 'Sala equipada con tecnología para reuniones corporativas, administrativas y de copropietarios.',
      capacidad: 15,
      icono: '💼',
      color: 'from-indigo-500 to-purple-500',
      tarifa: 70000,
      disponible: true,
      horarios: [
        { id: 'juntas-mañana', nombre: 'Mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true, precio: 70000 },
        { id: 'juntas-tarde', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true, precio: 70000 },
        { id: 'juntas-noche', nombre: 'Noche', horaInicio: '18:00', horaFin: '21:00', disponible: true, precio: 80000 }
      ]
    },
    {
      id: 6,
      nombre: 'Gimnasio',
      descripcion: 'Gimnasio completamente equipado con máquinas modernas para rutinas de ejercicio y entrenamiento.',
      capacidad: 12,
      icono: '💪',
      color: 'from-red-500 to-pink-500',
      tarifa: 50000,
      disponible: true,
      horarios: [
        { id: 'gym-madrugada', nombre: 'Madrugada', horaInicio: '05:00', horaFin: '08:00', disponible: true, precio: 50000 },
        { id: 'gym-mañana', nombre: 'Mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true, precio: 50000 },
        { id: 'gym-tarde', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true, precio: 50000 },
        { id: 'gym-noche', nombre: 'Noche', horaInicio: '18:00', horaFin: '22:00', disponible: true, precio: 60000 }
      ]
    }
  ];

  private reservasMock: Reserva[] = [
    {
      id: 1,
      zonaId: 1,
      zona: 'Salón Social',
      fecha: '2025-01-20',
      horarioId: 'salon-tarde',
      horario: 'Tarde (14:00 - 18:00)',
      usuario: 'María González Pérez',
      estado: 'confirmada',
      observaciones: 'Celebración cumpleaños familiar',
      costoTotal: 120000,
      fechaCreacion: '2025-01-15'
    },
    {
      id: 2,
      zonaId: 2,
      zona: 'Piscina',
      fecha: '2025-01-25',
      horarioId: 'piscina-tarde',
      horario: 'Tarde (14:00 - 18:00)',
      usuario: 'Carlos Rodríguez Silva',
      estado: 'pendiente',
      costoTotal: 90000,
      fechaCreacion: '2025-01-16'
    },
    {
      id: 3,
      zonaId: 3,
      zona: 'Cancha Múltiple',
      fecha: '2025-01-18',
      horarioId: 'cancha-noche',
      horario: 'Noche (18:00 - 22:00)',
      usuario: 'Ana López Martín',
      estado: 'confirmada',
      observaciones: 'Partido de fútbol entre amigos',
      costoTotal: 70000,
      fechaCreacion: '2025-01-14'
    },
    {
      id: 4,
      zonaId: 4,
      zona: 'Zona BBQ',
      fecha: '2025-01-22',
      horarioId: 'bbq-noche',
      horario: 'Noche (19:00 - 23:00)',
      usuario: 'Luis Fernando Torres',
      estado: 'confirmada',
      costoTotal: 100000,
      fechaCreacion: '2025-01-16'
    }
  ];

  constructor() {
    this.reservasSubject.next(this.reservasMock);
  }

  getZonasComunes(): ZonaComun[] {
    return this.zonasComunes;
  }

  getZonaById(id: number): ZonaComun | undefined {
    return this.zonasComunes.find(zona => zona.id === id);
  }

  getReservas(): Observable<Reserva[]> {
    return this.reservas$;
  }

  getReservasPorFecha(fecha: string): Reserva[] {
    return this.reservasSubject.value.filter(reserva => reserva.fecha === fecha);
  }

  crearReserva(reserva: Omit<Reserva, 'id' | 'fechaCreacion'>): Observable<Reserva> {
    return new Observable(observer => {
      const nuevaReserva: Reserva = {
        ...reserva,
        id: this.reservasSubject.value.length + 1,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };

      const reservasActuales = this.reservasSubject.value;
      reservasActuales.push(nuevaReserva);
      this.reservasSubject.next(reservasActuales);

      observer.next(nuevaReserva);
      observer.complete();
    });
  }

  cancelarReserva(id: number): Observable<boolean> {
    return new Observable(observer => {
      const reservas = this.reservasSubject.value;
      const reserva = reservas.find(r => r.id === id);

      if (reserva) {
        reserva.estado = 'cancelada';
        this.reservasSubject.next(reservas);
        observer.next(true);
      } else {
        observer.next(false);
      }

      observer.complete();
    });
  }

  isHorarioDisponible(zonaId: number, fecha: string, horarioId: string): boolean {
    const reservasDelDia = this.getReservasPorFecha(fecha);
    return !reservasDelDia.some(reserva =>
      reserva.zonaId === zonaId &&
      reserva.horarioId === horarioId &&
      reserva.estado !== 'cancelada'
    );
  }
}
