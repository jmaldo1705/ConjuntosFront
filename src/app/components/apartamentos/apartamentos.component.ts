import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApartamentosService, Apartamento, FiltrosApartamentos, ConjuntoInfo } from '../../services/apartamentos.service';
import { ToastService } from '../../services/toast.service';
import { DatosApartamentos } from '../../resolvers/apartamentos.resolver';

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartamentos.component.html',
  styleUrl: './apartamentos.component.css'
})
export class ApartamentosComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private busquedaSubject = new Subject<string>();

  // Filtros
  filtroActivo = 'todos';
  filtroConjunto = '';
  busquedaTexto = '';
  apartamentosFiltrados: Apartamento[] = [];

  // Estado de carga
  cargando = false;
  error: string | null = null;
  datosInicializados = false;

  // Apartamento seleccionado para vista detallada
  apartamentoSeleccionado: Apartamento | null = null;
  imagenActual = 0;

  // Datos del servicio
  apartamentos: Apartamento[] = [];
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
    this.cargarDatosDesdeResolver();
    this.suscribirACambiosDelServicio();
  }

  ngOnDestroy(): void {
    this.busquedaSubject.complete();
  }

  /**
   * Cargar datos que fueron pre-cargados por el resolver
   */
  private cargarDatosDesdeResolver(): void {
    const datos = this.route.snapshot.data['datos'] as DatosApartamentos;

    if (datos) {
      if (datos.error) {
        this.error = datos.error;
        this.toastService.error(datos.error, 'Error de Carga');
      } else {
        // Datos de apartamentos
        this.apartamentos = datos.apartamentos.apartamentos;
        this.totalApartamentos = datos.apartamentos.total;

        // Datos de conjuntos
        this.conjuntosInfo = datos.conjuntos;
        this.conjuntos = datos.conjuntos.map(c => c.nombre);

        // Aplicar filtros iniciales y actualizar estadísticas
        this.aplicarFiltrosLocales();
        this.actualizarEstadisticas();
        this.datosInicializados = true;

        // Actualizar los BehaviorSubjects del servicio también
        this.apartamentosService['apartamentosSubject'].next(this.apartamentos);
        this.apartamentosService['conjuntosSubject'].next(this.conjuntos);
        this.apartamentosService['conjuntosInfoSubject'].next(this.conjuntosInfo);
      }
    }
  }

  /**
   * Suscribirse a cambios del servicio para actualizaciones futuras
   */
  private suscribirACambiosDelServicio(): void {
    this.apartamentosService.apartamentos$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(apartamentos => {
      // Solo actualizar si hay cambios y ya se inicializaron los datos
      if (this.datosInicializados && apartamentos.length > 0) {
        this.apartamentos = apartamentos;
        this.aplicarFiltrosLocales();
        this.actualizarEstadisticas();
      }
    });

    this.apartamentosService.conjuntos$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(conjuntos => {
      if (this.datosInicializados && conjuntos.length > 0) {
        this.conjuntos = conjuntos;
      }
    });

    this.apartamentosService.conjuntosInfo$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(conjuntosInfo => {
      if (this.datosInicializados && conjuntosInfo.length > 0) {
        this.conjuntosInfo = conjuntosInfo;
      }
    });

    this.apartamentosService.cargando$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cargando => {
      this.cargando = cargando;
    });
  }

  /**
   * Inicializar búsqueda con debounce
   */
  private inicializarBusqueda(): void {
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(termino => {
      this.busquedaTexto = termino;
      this.aplicarFiltros();
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
    return this.apartamentos.length > 0;
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

    this.cargando = true;
    this.apartamentosService.obtenerApartamentos(filtros).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.apartamentosFiltrados = response.apartamentos;
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al aplicar filtros. Por favor, intenta nuevamente.';
        this.cargando = false;
        console.error('Error:', error);
        this.toastService.error('Error al aplicar filtros', 'Error');
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
   * Recargar datos manualmente
   */
  recargarDatos(): void {
    this.cargando = true;
    this.error = null;

    this.apartamentosService.obtenerApartamentos().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.apartamentos = response.apartamentos;
        this.totalApartamentos = response.total;
        this.aplicarFiltrosLocales();
        this.actualizarEstadisticas();
        this.cargando = false;
        this.toastService.success('Datos actualizados correctamente', 'Éxito');
      },
      error: (error) => {
        this.error = 'Error al recargar datos. Por favor, intenta nuevamente.';
        this.cargando = false;
        console.error('Error:', error);
        this.toastService.error('Error al recargar datos', 'Error');
      }
    });
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
