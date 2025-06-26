
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ToastService } from '../../services/toast.service';
import { ZonaComun, Reserva, HorarioZona } from '../../models/reserva.model';

interface DiaCalendario {
  fecha: Date;
  numero: number;
  esHoy: boolean;
  esPasado: boolean;
  esOtroMes: boolean;
  reservas: Reserva[];
  esFestivo?: boolean;
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

  isBrowser: boolean;

  // Estado del componente
  cargando = true;
  mostrarModalReserva = false;
  mostrarDetalleReserva = false;
  fechaSeleccionada = '';
  zonaSeleccionada: ZonaComun | null = null;
  horarioSeleccionado: HorarioZona | null = null;
  reservaSeleccionada: Reserva | null = null;
  modoVista = 'month';

  // Datos de reservas
  reservas: Reserva[] = [];
  zonasComunes: ZonaComun[] = [];

  // Calendario
  fechaActual = new Date();
  diasCalendario: DiaCalendario[] = [];
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Estadísticas
  totalReservas = 0;
  reservasActivas = 0;
  reservasPendientes = 0;
  ingresosMes = 0;

  // Formulario
  formularioReserva = {
    usuario: '',
    observaciones: ''
  };

  // Lista de reservas para vista de lista
  get reservasDelMes(): Reserva[] {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    return this.reservas.filter(reserva => {
      const fechaReserva = new Date(reserva.fecha);
      return fechaReserva.getFullYear() === año &&
        fechaReserva.getMonth() === mes;
    }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private reservasService: ReservasService,
    private toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.zonasComunes = this.reservasService.getZonasComunes();

    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.calcularEstadisticas();
        this.generarCalendario();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.cargando = false;
        this.toastService.error('Error al cargar las reservas', 'Error');
      }
    });
  }

  private calcularEstadisticas(): void {
    this.totalReservas = this.reservas.length;
    this.reservasActivas = this.reservas.filter(r => r.estado === 'confirmada').length;
    this.reservasPendientes = this.reservas.filter(r => r.estado === 'pendiente').length;
    this.ingresosMes = this.reservas
      .filter(r => r.estado === 'confirmada')
      .reduce((total, r) => total + r.costoTotal, 0);
  }

  private generarCalendario(): void {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0);

    // Día de la semana del primer día (0 = domingo)
    const primerDiaSemana = primerDia.getDay();

    this.diasCalendario = [];

    // Días del mes anterior
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const fecha = new Date(año, mes, -i);
      this.diasCalendario.push(this.crearDiaCalendario(fecha, true));
    }

    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(año, mes, dia);
      this.diasCalendario.push(this.crearDiaCalendario(fecha, false));
    }

    // Días del mes siguiente para completar la grilla
    const diasRestantes = 42 - this.diasCalendario.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(año, mes + 1, dia);
      this.diasCalendario.push(this.crearDiaCalendario(fecha, true));
    }
  }

  private crearDiaCalendario(fecha: Date, esOtroMes: boolean): DiaCalendario {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);

    const fechaStr = this.formatearFecha(fecha);

    return {
      fecha,
      numero: fecha.getDate(),
      esHoy: fechaComparar.getTime() === hoy.getTime(),
      esPasado: fechaComparar < hoy,
      esOtroMes,
      reservas: this.reservas.filter(r => r.fecha === fechaStr),
      esFestivo: this.esFestivo(fecha)
    };
  }

  private esFestivo(fecha: Date): boolean {
    // Aquí puedes agregar la lógica para detectar días festivos
    // Por ahora solo marcamos los domingos
    return fecha.getDay() === 0;
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  // Navegación del calendario
  mesAnterior(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 1, 1);
    this.generarCalendario();
  }

  mesSiguiente(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 1);
    this.generarCalendario();
  }

  irAHoy(): void {
    this.fechaActual = new Date();
    this.generarCalendario();
  }

  // Selección de fecha
  seleccionarFecha(dia: DiaCalendario): void {
    if (dia.esPasado && !dia.esHoy) return;

    this.fechaSeleccionada = this.formatearFecha(dia.fecha);
    this.mostrarModalReserva = true;
  }

  // Ver detalle de reserva
  verDetalleReserva(reserva: Reserva, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.reservaSeleccionada = reserva;
    this.mostrarDetalleReserva = true;
  }

  // Cambiar vista
  cambiarVista(vista: string): void {
    this.modoVista = vista;
  }

  // Obtener reservas de un día
  getReservasDelDia(dia: DiaCalendario): ReservaDelDia[] {
    return dia.reservas.map(reserva => ({
      reserva,
      color: this.obtenerColorZona(reserva.zonaId),
      icono: this.getZonaIcon(reserva.zonaId)
    }));
  }

  // Métodos de gestión de reservas
  seleccionarZona(zona: ZonaComun): void {
    this.zonaSeleccionada = zona;
    this.horarioSeleccionado = null;
  }

  seleccionarHorario(horario: HorarioZona): void {
    if (this.esHorarioDisponible(horario.id)) {
      this.horarioSeleccionado = horario;
    }
  }

  esHorarioDisponible(horarioId: string): boolean {
    if (!this.zonaSeleccionada || !this.fechaSeleccionada) return false;

    return this.reservasService.isHorarioDisponible(
      this.zonaSeleccionada.id,
      this.fechaSeleccionada,
      horarioId
    );
  }

  crearReserva(): void {
    if (!this.zonaSeleccionada || !this.horarioSeleccionado || !this.formularioReserva.usuario.trim()) {
      this.toastService.error('Por favor completa todos los campos requeridos', 'Error');
      return;
    }

    const nuevaReserva = {
      zonaId: this.zonaSeleccionada.id,
      zona: this.zonaSeleccionada.nombre,
      fecha: this.fechaSeleccionada,
      horarioId: this.horarioSeleccionado.id,
      horario: `${this.horarioSeleccionado.nombre} (${this.horarioSeleccionado.horaInicio} - ${this.horarioSeleccionado.horaFin})`,
      usuario: this.formularioReserva.usuario,
      estado: 'pendiente' as const,
      observaciones: this.formularioReserva.observaciones,
      costoTotal: this.horarioSeleccionado.precio
    };

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: (reserva) => {
        this.toastService.success('Reserva creada exitosamente', '¡Éxito!');
        this.cerrarModalReserva();
        this.cargarDatos();
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        this.toastService.error('Error al crear la reserva', 'Error');
      }
    });
  }

  cancelarReserva(): void {
    if (!this.reservaSeleccionada) return;

    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservasService.cancelarReserva(this.reservaSeleccionada.id).subscribe({
        next: (resultado) => {
          if (resultado) {
            this.toastService.success('Reserva cancelada exitosamente', '¡Cancelada!');
            this.cerrarDetalleReserva();
            this.cargarDatos();
          } else {
            this.toastService.error('No se pudo cancelar la reserva', 'Error');
          }
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
          this.toastService.error('Error al cancelar la reserva', 'Error');
        }
      });
    }
  }

  // Métodos auxiliares
  cerrarModalReserva(): void {
    this.mostrarModalReserva = false;
    this.zonaSeleccionada = null;
    this.horarioSeleccionado = null;
    this.formularioReserva = { usuario: '', observaciones: '' };
    this.fechaSeleccionada = '';
  }

  cerrarDetalleReserva(): void {
    this.mostrarDetalleReserva = false;
    this.reservaSeleccionada = null;
  }

  abrirModalNuevaReserva(): void {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
    this.mostrarModalReserva = true;
  }

  get fechaSeleccionadaFormateada(): string {
    if (!this.fechaSeleccionada) return '';
    const fecha = new Date(this.fechaSeleccionada + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get mesAnio(): string {
    return `${this.meses[this.fechaActual.getMonth()]} ${this.fechaActual.getFullYear()}`;
  }

  obtenerColorZona(zonaId: number): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    if (zona) {
      // Extraer color del gradient
      const colores: { [key: string]: string } = {
        'from-purple-500 to-pink-500': '#8b5cf6',
        'from-blue-500 to-cyan-500': '#3b82f6',
        'from-green-500 to-emerald-500': '#10b981',
        'from-orange-500 to-red-500': '#f97316',
        'from-indigo-500 to-purple-500': '#6366f1',
        'from-red-500 to-pink-500': '#ef4444'
      };
      return colores[zona.color] || '#8b5cf6';
    }
    return '#8b5cf6';
  }

  // ✅ Cambiar de private a public
  getZonaIcon(zonaId: number): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    return zona?.icono || '📍';
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  formatearFechaLista(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  }

  // ✅ Agregar método para crear fecha desde string
  crearFecha(fechaString: string): Date {
    return new Date(fechaString + 'T00:00:00');
  }

  // ✅ Agregar método para obtener día del mes
  obtenerDiaDelMes(fechaString: string): number {
    return this.crearFecha(fechaString).getDate();
  }

  // ✅ Agregar método para formatear fecha completa
  formatearFechaCompleta(fechaString: string): string {
    return this.crearFecha(fechaString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  trackByDia(index: number, dia: DiaCalendario): string {
    return dia.fecha.toISOString();
  }

  trackByReserva(index: number, reserva: Reserva): number {
    return reserva.id;
  }

  ngOnDestroy(): void {
    // Limpiar recursos si es necesario
  }
}
