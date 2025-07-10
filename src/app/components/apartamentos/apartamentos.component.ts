import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApartamentosService, Apartamento, FiltrosApartamentos, ConjuntoInfo } from '../../services/apartamentos.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartamentos.component.html',
  styleUrl: './apartamentos.component.css'
})
export class ApartamentosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private busquedaSubject = new Subject<string>();

  // Filtros
  filtroActivo = 'todos';
  filtroConjunto = '';
  busquedaTexto = '';
  apartamentosFiltrados: Apartamento[] = [];

  // Estado de carga
  cargando = false;
  error: string | null = null;

  // Apartamento seleccionado para vista detallada
  apartamentoSeleccionado: Apartamento | null = null;
  imagenActual = 0;

  // Datos del servicio
  apartamentos: Apartamento[] = []; // Datos completos originales
  conjuntos: string[] = [];
  conjuntosInfo: ConjuntoInfo[] = [];

  // Estadísticas
  totalApartamentos = 0;
  apartamentosVenta = 0;
  apartamentosArriendo = 0;

  constructor(
    private apartamentosService: ApartamentosService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.inicializarBusqueda();
    this.cargarDatos();
    this.cargarConjuntos();
    this.suscribirACambios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializar búsqueda con debounce
   */
  private inicializarBusqueda(): void {
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(termino => {
      this.busquedaTexto = termino;
      this.aplicarFiltros();
    });
  }

  /**
   * Suscribirse a cambios del servicio
   */
  private suscribirACambios(): void {
    this.apartamentosService.apartamentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(apartamentos => {
        this.apartamentos = apartamentos;
        this.aplicarFiltrosLocales();
        this.actualizarEstadisticas();
      });

    this.apartamentosService.conjuntos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conjuntos => {
        this.conjuntos = conjuntos;
      });

    this.apartamentosService.conjuntosInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conjuntosInfo => {
        this.conjuntosInfo = conjuntosInfo;
      });

    this.apartamentosService.cargando$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cargando => {
        this.cargando = cargando;
      });
  }

  /**
   * Cargar datos iniciales
   */
  private cargarDatos(): void {
    this.error = null;
    this.apartamentosService.obtenerApartamentos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalApartamentos = response.total;
        },
        error: (error) => {
          this.error = 'Error al cargar los apartamentos. Por favor, intenta nuevamente.';
          this.toastService.error('Error al cargar los apartamentos', 'Error');
          console.error('Error:', error);
        }
      });
  }

  /**
   * Cargar conjuntos completos
   */
  private cargarConjuntos(): void {
    this.apartamentosService.obtenerConjuntosCompletos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conjuntos) => {
          // Los conjuntos se actualizan automáticamente a través del observable
        },
        error: (error) => {
          this.toastService.error('Error al cargar los conjuntos', 'Error');
          console.error('Error:', error);
        }
      });
  }

  /**
   * Actualizar estadísticas basadas en TODOS los apartamentos
   */
  private actualizarEstadisticas(): void {
    this.apartamentosVenta = this.apartamentos.filter(a => a.tipo === 'venta').length;
    this.apartamentosArriendo = this.apartamentos.filter(a => a.tipo === 'arriendo').length;
  }

  /**
   * Aplicar filtros locales (para tipo todos/venta/arriendo)
   */
  private aplicarFiltrosLocales(): void {
    let apartamentosFiltrados = [...this.apartamentos];

    // Filtrar por tipo si no es "todos"
    if (this.filtroActivo !== 'todos') {
      apartamentosFiltrados = apartamentosFiltrados.filter(a => a.tipo === this.filtroActivo);
    }

    // Filtrar por conjunto si está seleccionado
    if (this.filtroConjunto) {
      apartamentosFiltrados = apartamentosFiltrados.filter(a => a.conjunto === this.filtroConjunto);
    }

    // Filtrar por búsqueda de texto
    if (this.busquedaTexto) {
      const termino = this.busquedaTexto.toLowerCase();
      apartamentosFiltrados = apartamentosFiltrados.filter(a =>
        a.titulo.toLowerCase().includes(termino) ||
        a.descripcion.toLowerCase().includes(termino) ||
        a.conjunto.toLowerCase().includes(termino) ||
        a.torre.toLowerCase().includes(termino) ||
        a.apartamento.toLowerCase().includes(termino)
      );
    }

    this.apartamentosFiltrados = apartamentosFiltrados;
  }

  /**
   * Aplicar filtros (decidir si usar filtros locales o ir al backend)
   */
  aplicarFiltros(): void {
    // Para filtros básicos (tipo, conjunto, búsqueda), usar filtros locales
    if (this.debeUsarFiltrosLocales()) {
      this.aplicarFiltrosLocales();
    } else {
      // Para filtros más complejos, ir al backend
      this.aplicarFiltrosBackend();
    }
  }

  /**
   * Determinar si se pueden usar filtros locales
   */
  private debeUsarFiltrosLocales(): boolean {
    // Usar filtros locales si solo se está filtrando por tipo, conjunto o búsqueda básica
    return this.apartamentos.length > 0 &&
      !this.tieneOtrosFiltros();
  }

  /**
   * Verificar si hay otros filtros que requieren backend
   */
  private tieneOtrosFiltros(): boolean {
    // Aquí podrías agregar lógica para detectar filtros más complejos
    // que requieran consulta al backend
    return false;
  }

  /**
   * Aplicar filtros usando el backend
   */
  private aplicarFiltrosBackend(): void {
    const filtros: FiltrosApartamentos = {
      tipo: this.filtroActivo !== 'todos' ? this.filtroActivo as 'venta' | 'arriendo' : undefined,
      conjunto: this.filtroConjunto || undefined,
      busqueda: this.busquedaTexto || undefined
    };

    this.apartamentosService.obtenerApartamentos(filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.apartamentosFiltrados = response.apartamentos;
        },
        error: (error) => {
          this.toastService.error('Error al aplicar filtros', 'Error');
          console.error('Error:', error);
        }
      });
  }

  /**
   * Filtrar por tipo
   */
  filtrarPor(tipo: string): void {
    this.filtroActivo = tipo;
    this.aplicarFiltros();
  }

  /**
   * Cambiar filtro de conjunto
   */
  onConjuntoChange(): void {
    this.aplicarFiltros();
  }

  /**
   * Búsqueda por texto con debounce
   */
  onBusquedaChange(): void {
    this.busquedaSubject.next(this.busquedaTexto);
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.filtroActivo = 'todos';
    this.filtroConjunto = '';
    this.busquedaTexto = '';
    this.aplicarFiltrosLocales();
  }

  /**
   * Recargar datos
   */
  recargarDatos(): void {
    this.cargarDatos();
    this.cargarConjuntos();
  }

  // Computed properties para evitar cálculos en el template
  get apartamentosVentaCount(): number {
    return this.apartamentosVenta;
  }

  get apartamentosArriendoCount(): number {
    return this.apartamentosArriendo;
  }

  // TrackBy function para optimizar rendimiento
  trackByApartamento(index: number, apartamento: Apartamento): number {
    return apartamento.id;
  }

  // Formatear precio
  formatearPrecio(precio: number, tipo: string): string {
    if (tipo === 'venta') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio);
    } else {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio) + '/mes';
    }
  }

  // Ver detalles del apartamento
  verDetalles(apartamento: Apartamento): void {
    this.apartamentoSeleccionado = apartamento;
    this.imagenActual = 0;
  }

  // Cerrar vista de detalles
  cerrarDetalles(): void {
    this.apartamentoSeleccionado = null;
    this.imagenActual = 0;
  }

  // Navegación de imágenes
  imagenAnterior(): void {
    if (this.apartamentoSeleccionado) {
      this.imagenActual = this.imagenActual > 0
        ? this.imagenActual - 1
        : this.apartamentoSeleccionado.imagenes.length - 1;
    }
  }

  imagenSiguiente(): void {
    if (this.apartamentoSeleccionado) {
      this.imagenActual = this.imagenActual < this.apartamentoSeleccionado.imagenes.length - 1
        ? this.imagenActual + 1
        : 0;
    }
  }

  // Contactar para más información
  contactarInfo(apartamento: Apartamento | null): void {
    if (!apartamento) return;

    const mensaje = `Hola, estoy interesado en el ${apartamento.titulo} (${apartamento.torre}${apartamento.apartamento}) en ${apartamento.conjunto}. ¿Podrían darme más información?`;
    const numeroWhatsApp = '+573214567890';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  // Programar visita
  programarVisita(apartamento: Apartamento | null): void {
    if (!apartamento) return;

    const mensaje = `Hola, me gustaría programar una visita al ${apartamento.titulo} (${apartamento.torre}${apartamento.apartamento}) en ${apartamento.conjunto}. ¿Cuándo sería posible?`;
    const numeroWhatsApp = '+573214567890';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}
