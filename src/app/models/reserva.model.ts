export interface ZonaComun {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  icono: string;
  color: string;
  tarifa: number;
  disponible: boolean;
  horarios: HorarioZona[];
}

export interface HorarioZona {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  precio: number;
}

export interface Reserva {
  id: number;
  zonaId: number;
  zona: string;
  fecha: string;
  horarioId: string;
  horario: string;
  usuario: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'solicitud_cancelacion';
  observaciones?: string;
  costoTotal: number;
  fechaCreacion: string;
}

export interface DiaCalendario {
  numero: number | string;
  fecha?: Date;
  reservas: ReservaCalendario[];
  seleccionado: boolean;
  vacio: boolean;
  esHoy: boolean;
  esPasado: boolean;
}

export interface ReservaCalendario {
  zona: string;
  horario: string;
  color: string;
  usuario: string;
  estado: string;
}
