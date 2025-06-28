import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ReservasService } from '../../services/reservas.service';
import { SessionService } from '../../services/session.service';

interface Horario {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
}

interface ZonaComun {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  tarifa: number;
  requiereReserva: boolean;
  horarios: Horario[];
}

interface Reserva {
  id: string;
  fecha: string;
  zonaId: string;
  zona: string;
  horarioId: string;
  horario: string;
  usuario: string;
  nombreEvento?: string;
  observaciones?: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'solicitud_cancelacion';
  costoTotal: number;
  fechaCreacion: string;
}

interface DiaCalendario {
  numero: number;
  fecha: string;
  esHoy: boolean;
  esOtroMes: boolean;
  esPasado: boolean;
  esFestivo: boolean;
  reservas: Reserva[];
}

interface ReservaDelDia {
  reserva: Reserva;
  color: string;
  icono: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Propiedades de vista
  modoVista: 'month' | 'list' = 'month';
  fechaActual = new Date();
  mesAnio = '';
  cargando = false;

  // Datos del usuario
  usuarioLogueado: string = 'Juan Pérez';
  fechaMinima: string = new Date().toISOString().split('T')[0];

  // Arrays de datos
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasCalendario: DiaCalendario[] = [];
  reservas: Reserva[] = [];
  reservasDelMes: Reserva[] = [];

  // Estadísticas
  totalReservas = 0;
  reservasActivas = 0;
  reservasPendientes = 0;

  // Modal Nueva Reserva
  mostrarModalReserva = false;
  fechaSeleccionada = '';
  zonaSeleccionada: ZonaComun | null = null;
  horarioSeleccionado: Horario | null = null;
  formularioReserva = {
    nombreEvento: '',
    observaciones: ''
  };

  // Modal Detalle
  mostrarDetalleReserva = false;
  reservaSeleccionada: Reserva | null = null;

  // Modal Zonas Sociales
  mostrarModalZonas = false;

  // Zonas comunes con información completa
  zonasComunes: ZonaComun[] = [
    {
      id: '1',
      nombre: 'Salón Social',
      descripcion: 'Amplio salón para eventos sociales y reuniones',
      icono: '🎉',
      tarifa: 150000,
      requiereReserva: true,
      horarios: [
        { id: '1-1', nombre: 'Mañana', horaInicio: '08:00', horaFin: '12:00', precio: 150000 },
        { id: '1-2', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', precio: 150000 },
        { id: '1-3', nombre: 'Noche', horaInicio: '19:00', horaFin: '23:00', precio: 200000 },
        { id: '1-4', nombre: 'Todo el día', horaInicio: '08:00', horaFin: '23:00', precio: 400000 }
      ]
    },
    {
      id: '2',
      nombre: 'BBQ',
      descripcion: 'Zona de asados con parrillas y mesas',
      icono: '🔥',
      tarifa: 80000,
      requiereReserva: true,
      horarios: [
        { id: '2-1', nombre: 'Mañana', horaInicio: '10:00', horaFin: '14:00', precio: 80000 },
        { id: '2-2', nombre: 'Tarde', horaInicio: '15:00', horaFin: '19:00', precio: 80000 },
        { id: '2-3', nombre: 'Noche', horaInicio: '19:00', horaFin: '22:00', precio: 100000 }
      ]
    },
    {
      id: '3',
      nombre: 'Piscina',
      descripcion: 'Área de piscina para adultos y niños',
      icono: '🏊',
      tarifa: 0,
      requiereReserva: false,
      horarios: [
        { id: '3-1', nombre: 'Mañana', horaInicio: '06:00', horaFin: '12:00', precio: 0 },
        { id: '3-2', nombre: 'Tarde', horaInicio: '13:00', horaFin: '18:00', precio: 0 },
        { id: '3-3', nombre: 'Noche', horaInicio: '18:00', horaFin: '21:00', precio: 0 }
      ]
    },
    {
      id: '4',
      nombre: 'Cancha Tenis',
      descripcion: 'Cancha profesional de tenis',
      icono: '🎾',
      tarifa: 25000,
      requiereReserva: true,
      horarios: [
        { id: '4-1', nombre: '1 hora', horaInicio: '06:00', horaFin: '07:00', precio: 25000 },
        { id: '4-2', nombre: '2 horas', horaInicio: '06:00', horaFin: '08:00', precio: 45000 },
        { id: '4-3', nombre: '3 horas', horaInicio: '06:00', horaFin: '09:00', precio: 65000 }
      ]
    },
    {
      id: '5',
      nombre: 'Gimnasio',
      descripcion: 'Gimnasio equipado con máquinas y pesas',
      icono: '💪',
      tarifa: 0,
      requiereReserva: false,
      horarios: [
        { id: '5-1', nombre: 'Mañana', horaInicio: '05:00', horaFin: '12:00', precio: 0 },
        { id: '5-2', nombre: 'Tarde', horaInicio: '14:00', horaFin: '18:00', precio: 0 },
        { id: '5-3', nombre: 'Noche', horaInicio: '18:00', horaFin: '22:00', precio: 0 }
      ]
    },
    {
      id: '6',
      nombre: 'Sala de Juegos',
      descripcion: 'Sala recreativa con juegos de mesa y videojuegos',
      icono: '🎮',
      tarifa: 15000,
      requiereReserva: true,
      horarios: [
        { id: '6-1', nombre: '2 horas', horaInicio: '14:00', horaFin: '16:00', precio: 15000 },
        { id: '6-2', nombre: '3 horas', horaInicio: '14:00', horaFin: '17:00', precio: 20000 },
        { id: '6-3', nombre: '4 horas', horaInicio: '14:00', horaFin: '18:00', precio: 25000 }
      ]
    }
  ];

  constructor(
    private toastService: ToastService,
    private reservasService: ReservasService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
    this.inicializarCalendario();
    this.cargarReservas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerUsuarioLogueado(): void {
    const usuario = this.sessionService.getCurrentUser();
    if (usuario) {
      this.usuarioLogueado = usuario.nombre || 'Usuario Actual';
    }
  }

  inicializarCalendario(): void {
    this.actualizarMesAnio();
    this.generarDiasCalendario();
  }

  actualizarMesAnio(): void {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.mesAnio = `${meses[this.fechaActual.getMonth()]} ${this.fechaActual.getFullYear()}`;
  }

  generarDiasCalendario(): void {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDia.getDay();
    const diasEnMes = ultimoDia.getDate();

    this.diasCalendario = [];

    // Días del mes anterior
    const mesAnterior = new Date(año, mes - 1, 0);
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = mesAnterior.getDate() - i;
      this.diasCalendario.push({
        numero: dia,
        fecha: new Date(año, mes - 1, dia).toISOString().split('T')[0],
        esHoy: false,
        esOtroMes: true,
        esPasado: true,
        esFestivo: false,
        reservas: []
      });
    }

    // Días del mes actual
    const hoy = new Date();
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes, dia);
      const fechaStr = fecha.toISOString().split('T')[0];
      this.diasCalendario.push({
        numero: dia,
        fecha: fechaStr,
        esHoy: this.esMismaFecha(fecha, hoy),
        esOtroMes: false,
        esPasado: fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
        esFestivo: this.esFestivo(fecha),
        reservas: this.reservas.filter(r => r.fecha === fechaStr)
      });
    }

    // Días del mes siguiente
    const diasRestantes = 42 - this.diasCalendario.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      this.diasCalendario.push({
        numero: dia,
        fecha: new Date(año, mes + 1, dia).toISOString().split('T')[0],
        esHoy: false,
        esOtroMes: true,
        esPasado: false,
        esFestivo: false,
        reservas: []
      });
    }
  }

  cargarReservas(): void {
    this.reservas = this.generarReservasMock();
    this.actualizarReservasDelMes();
    this.actualizarEstadisticas();
    this.actualizarReservasEnCalendario();
  }

  generarReservasMock(): Reserva[] {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    return [
      {
        id: '1',
        fecha: new Date(año, mes, 25).toISOString().split('T')[0],
        zonaId: '1',
        zona: 'Salón Social',
        horarioId: '1-3',
        horario: '19:00 - 23:00',
        usuario: 'María García',
        nombreEvento: 'Celebración Navidad',
        observaciones: 'Reunión familiar navideña',
        estado: 'confirmada',
        costoTotal: 200000,
        fechaCreacion: new Date(año, mes, 20).toISOString()
      },
      {
        id: '2',
        fecha: new Date(año, mes, 31).toISOString().split('T')[0],
        zonaId: '2',
        zona: 'BBQ',
        horarioId: '2-2',
        horario: '15:00 - 19:00',
        usuario: 'Carlos Rodríguez',
        nombreEvento: 'Despedida de año',
        observaciones: 'Asado familiar',
        estado: 'pendiente',
        costoTotal: 80000,
        fechaCreacion: new Date(año, mes, 22).toISOString()
      },
      {
        id: '3',
        fecha: new Date(año, mes, 15).toISOString().split('T')[0],
        zonaId: '3',
        zona: 'Piscina',
        horarioId: '3-2',
        horario: '13:00 - 18:00',
        usuario: 'Ana López',
        nombreEvento: 'Cumpleaños infantil',
        observaciones: 'Fiesta de niños',
        estado: 'confirmada',
        costoTotal: 0,
        fechaCreacion: new Date(año, mes, 10).toISOString()
      },
      {
        id: '4',
        fecha: new Date(año, mes + 1, 5).toISOString().split('T')[0],
        zonaId: '4',
        zona: 'Cancha Tenis',
        horarioId: '4-2',
        horario: '06:00 - 08:00',
        usuario: 'Luis Martínez',
        nombreEvento: 'Entrenamiento tenis',
        observaciones: 'Práctica semanal',
        estado: 'confirmada',
        costoTotal: 45000,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '5',
        fecha: new Date(año, mes + 1, 10).toISOString().split('T')[0],
        zonaId: '1',
        zona: 'Salón Social',
        horarioId: '1-2',
        horario: '14:00 - 18:00',
        usuario: 'Patricia Silva',
        nombreEvento: 'Reunión de propietarios',
        observaciones: 'Asamblea mensual',
        estado: 'solicitud_cancelacion',
        costoTotal: 150000,
        fechaCreacion: new Date().toISOString()
      }
    ];
  }

  actualizarReservasDelMes(): void {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    this.reservasDelMes = this.reservas.filter(reserva => {
      const fechaReserva = new Date(reserva.fecha);
      return fechaReserva.getFullYear() === año && fechaReserva.getMonth() === mes;
    });
  }

  actualizarReservasEnCalendario(): void {
    this.diasCalendario.forEach(dia => {
      dia.reservas = this.reservas.filter(r => r.fecha === dia.fecha);
    });
  }

  actualizarEstadisticas(): void {
    this.totalReservas = this.reservas.length;
    this.reservasActivas = this.reservas.filter(r => r.estado === 'confirmada').length;
    this.reservasPendientes = this.reservas.filter(r => r.estado === 'pendiente').length;
  }

  // Métodos de navegación
  cambiarVista(vista: 'month' | 'list'): void {
    this.modoVista = vista;
  }

  mesAnterior(): void {
    this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    this.inicializarCalendario();
    this.actualizarReservasDelMes();
    this.actualizarReservasEnCalendario();
  }

  mesSiguiente(): void {
    this.fechaActual.setMonth(this.fechaActual.getMonth() + 1);
    this.inicializarCalendario();
    this.actualizarReservasDelMes();
    this.actualizarReservasEnCalendario();
  }

  irAHoy(): void {
    this.fechaActual = new Date();
    this.inicializarCalendario();
    this.actualizarReservasDelMes();
    this.actualizarReservasEnCalendario();
  }

  // Métodos del Modal de Zonas Sociales
  abrirModalZonas(): void {
    this.mostrarModalZonas = true;
  }

  cerrarModalZonas(): void {
    this.mostrarModalZonas = false;
  }

  // Métodos de modal Nueva Reserva
  abrirModalNuevaReserva(): void {
    this.mostrarModalReserva = true;
    this.fechaSeleccionada = '';
    this.zonaSeleccionada = null;
    this.horarioSeleccionado = null;
    this.formularioReserva = {
      nombreEvento: '',
      observaciones: ''
    };
  }

  cerrarModalReserva(): void {
    this.mostrarModalReserva = false;
    this.zonaSeleccionada = null;
    this.horarioSeleccionado = null;
    this.formularioReserva = {
      nombreEvento: '',
      observaciones: ''
    };
    this.fechaSeleccionada = '';
  }

  seleccionarFecha(dia: DiaCalendario): void {
    if (!dia.esPasado || dia.esHoy) {
      this.fechaSeleccionada = dia.fecha;
      this.zonaSeleccionada = null;
      this.horarioSeleccionado = null;
      this.formularioReserva = {
        nombreEvento: '',
        observaciones: ''
      };
      this.mostrarModalReserva = true;
    }
  }

  seleccionarZona(zona: ZonaComun): void {
    this.zonaSeleccionada = zona;
    this.horarioSeleccionado = null;
  }

  seleccionarHorario(horario: Horario): void {
    if (this.esHorarioDisponible(horario.id)) {
      this.horarioSeleccionado = horario;
    }
  }

  esHorarioDisponible(horarioId: string): boolean {
    if (!this.fechaSeleccionada) return false;

    return !this.reservas.some(reserva =>
      reserva.fecha === this.fechaSeleccionada &&
      reserva.horarioId === horarioId &&
      reserva.estado !== 'cancelada'
    );
  }

  crearReserva(): void {
    if (!this.formularioReserva.nombreEvento.trim()) {
      this.toastService.error('Por favor ingresa el nombre del evento o reserva');
      return;
    }

    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      fecha: this.fechaSeleccionada,
      zonaId: this.zonaSeleccionada!.id,
      zona: this.zonaSeleccionada!.nombre,
      horarioId: this.horarioSeleccionado!.id,
      horario: `${this.horarioSeleccionado!.horaInicio} - ${this.horarioSeleccionado!.horaFin}`,
      usuario: this.usuarioLogueado,
      nombreEvento: this.formularioReserva.nombreEvento,
      observaciones: this.formularioReserva.observaciones,
      estado: 'pendiente',
      costoTotal: this.horarioSeleccionado!.precio,
      fechaCreacion: new Date().toISOString()
    };

    this.reservas.push(nuevaReserva);
    this.actualizarEstadisticas();
    this.actualizarReservasDelMes();
    this.actualizarReservasEnCalendario();

    this.toastService.success('¡Reserva creada exitosamente!');
    this.cerrarModalReserva();
  }

  // Métodos de modal Detalle
  verDetalleReserva(reserva: Reserva, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.reservaSeleccionada = reserva;
    this.mostrarDetalleReserva = true;
  }

  cerrarDetalleReserva(): void {
    this.mostrarDetalleReserva = false;
    this.reservaSeleccionada = null;
  }

  // MÉTODO ACTUALIZADO - Lógica de cancelación mejorada
  cancelarReserva(): void {
    if (!this.reservaSeleccionada) return;

    const fechaReserva = new Date(this.reservaSeleccionada.fecha);
    const fechaActual = new Date();

    // Normalizar fechas para comparar solo día/mes/año
    fechaReserva.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    // Verificar si es una fecha pasada
    if (fechaReserva <= fechaActual) {
      this.toastService.error('No se pueden cancelar reservas de fechas pasadas');
      return;
    }

    // Lógica según el estado de la reserva
    switch (this.reservaSeleccionada.estado) {
      case 'pendiente':
        // Cancelación directa para reservas pendientes
        this.reservaSeleccionada.estado = 'cancelada';
        this.actualizarEstadisticas();
        this.toastService.success('Reserva cancelada exitosamente');
        this.cerrarDetalleReserva();
        break;

      case 'confirmada':
        // Solicitud de cancelación para reservas confirmadas
        this.reservaSeleccionada.estado = 'solicitud_cancelacion';
        this.actualizarEstadisticas();
        this.toastService.info('Solicitud de cancelación enviada. La administración revisará tu petición.');
        this.cerrarDetalleReserva();
        break;

      case 'cancelada':
        this.toastService.warning('Esta reserva ya está cancelada');
        break;

      case 'solicitud_cancelacion':
        this.toastService.info('Ya existe una solicitud de cancelación pendiente para esta reserva');
        break;

      default:
        this.toastService.error('Estado de reserva no válido');
    }
  }

  // NUEVO MÉTODO - Verificar si se puede cancelar una reserva
  puedesCancelarReserva(reserva: Reserva): boolean {
    const fechaReserva = new Date(reserva.fecha);
    const fechaActual = new Date();

    // Normalizar fechas
    fechaReserva.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    // Solo se puede cancelar si:
    // 1. La fecha es posterior a hoy
    // 2. El estado es 'pendiente' o 'confirmada'
    return fechaReserva > fechaActual &&
      (reserva.estado === 'pendiente' || reserva.estado === 'confirmada');
  }

  // NUEVO MÉTODO - Obtener texto del botón de cancelación
  getTextoCancelacion(reserva: Reserva): string {
    if (reserva.estado === 'pendiente') {
      return '🗑️ Cancelar Reserva';
    } else if (reserva.estado === 'confirmada') {
      return '📋 Solicitar Cancelación';
    }
    return 'No disponible';
  }

  // NUEVO MÉTODO - Obtener color del botón de cancelación
  getColorCancelacion(reserva: Reserva): string {
    if (reserva.estado === 'pendiente') {
      return 'bg-red-600 hover:bg-red-700';
    } else if (reserva.estado === 'confirmada') {
      return 'bg-orange-600 hover:bg-orange-700';
    }
    return 'bg-gray-400 cursor-not-allowed';
  }

  // Métodos de utilidad
  getReservasDelDia(dia: DiaCalendario): ReservaDelDia[] {
    return dia.reservas.map(reserva => ({
      reserva,
      color: this.getColorReserva(reserva.estado),
      icono: this.getZonaIcon(reserva.zonaId)
    }));
  }

  // MÉTODO ACTUALIZADO - Incluir nuevo estado
  getColorReserva(estado: string): string {
    switch (estado) {
      case 'confirmada': return '#10b981';
      case 'pendiente': return '#f59e0b';
      case 'cancelada': return '#ef4444';
      case 'solicitud_cancelacion': return '#f97316'; // Naranja para solicitudes
      default: return '#6b7280';
    }
  }

  getZonaIcon(zonaId: string): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    return zona?.icono || '📅';
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  formatearFechaLista(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short'
    });
  }

  formatearFechaCompleta(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerDiaDelMes(fecha: string): number {
    return new Date(fecha).getDate();
  }

  get fechaSeleccionadaFormateada(): string {
    if (!this.fechaSeleccionada) return '';
    return this.formatearFechaCompleta(this.fechaSeleccionada);
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate();
  }

  esFestivo(fecha: Date): boolean {
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;

    return (dia === 25 && mes === 12) ||
      (dia === 1 && mes === 1) ||
      (dia === 20 && mes === 7) ||
      (dia === 7 && mes === 8);
  }

  // Métodos de tracking para *ngFor
  trackByDia(index: number, dia: DiaCalendario): string {
    return dia.fecha;
  }

  trackByReserva(index: number, reserva: Reserva): string {
    return reserva.id;
  }
}
