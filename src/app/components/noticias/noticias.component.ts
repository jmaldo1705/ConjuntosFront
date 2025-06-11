
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../services/noticias.service';
import { Noticia } from '../../models/noticia.model';
import { Conjunto } from '../../models/shared.model';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {
  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  conjuntos: Conjunto[] = [];

  // Filtros disponibles
  categorias = ['Todas', 'Mantenimiento', 'Administración', 'Seguridad', 'Eventos'];
  prioridades = [
    { value: 'Todas', label: 'Todas las prioridades' },
    { value: 'alta', label: 'Alta prioridad' },
    { value: 'media', label: 'Prioridad media' },
    { value: 'baja', label: 'Prioridad baja' }
  ];
  alcances = [
    { value: 'Todos', label: 'Todo el conjunto' },
    { value: 'general', label: 'Áreas comunes' },
    { value: 'torre', label: 'Torres específicas' },
    { value: 'zona', label: 'Zonas específicas' }
  ];

  // Filtros seleccionados
  filtros = {
    categoria: 'Todas',
    prioridad: 'Todas',
    alcance: 'Todos',
    ubicacion: 'Todas',
    conjunto: 'Todos',
    busqueda: ''
  };

  // Listas dinámicas
  ubicacionesDisponibles: string[] = ['Todas'];
  conjuntosDisponibles: { value: string, label: string }[] = [
    { value: 'Todos', label: 'Todos los conjuntos' }
  ];

  // Estados de UI
  cargando = false;
  mostrarFiltrosAvanzados = false;

  constructor(private noticiasService: NoticiasService) {}

  ngOnInit() {
    this.cargarConjuntos();
    this.cargarNoticias();
  }

  cargarConjuntos() {
    this.noticiasService.getConjuntos().subscribe({
      next: (conjuntos: Conjunto[]) => {
        this.conjuntos = conjuntos;
        this.conjuntosDisponibles = [
          { value: 'Todos', label: 'Todos los conjuntos' },
          ...conjuntos.map(conjunto => ({
            value: conjunto.id,
            label: conjunto.nombre
          }))
        ];
      },
      error: (error: any) => {
        console.error('Error al cargar conjuntos:', error);
      }
    });
  }

  cargarNoticias() {
    this.cargando = true;

    // Cargar noticias de todos los conjuntos
    this.noticiasService.getNoticiasMulticonjunto().subscribe({
      next: (noticias: Noticia[]) => {
        this.noticias = noticias;
        this.actualizarUbicacionesDisponibles();
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar noticias:', error);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros() {
    this.noticiasFiltradas = this.noticiasService.filtrarNoticiasMulticonjunto(this.noticias, {
      categoria: this.filtros.categoria,
      prioridad: this.filtros.prioridad,
      alcance: this.filtros.alcance,
      ubicacion: this.filtros.ubicacion,
      conjuntoId: this.filtros.conjunto
    });

    // Filtro de búsqueda por texto
    if (this.filtros.busqueda.trim()) {
      const busqueda = this.filtros.busqueda.toLowerCase().trim();
      this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
        noticia.titulo.toLowerCase().includes(busqueda) ||
        noticia.resumen.toLowerCase().includes(busqueda) ||
        (noticia.ubicacion && noticia.ubicacion.toLowerCase().includes(busqueda)) ||
        (noticia.autor && noticia.autor.toLowerCase().includes(busqueda)) ||
        this.getNombreConjunto(noticia.conjuntoId).toLowerCase().includes(busqueda)
      );
    }
  }

  private actualizarUbicacionesDisponibles() {
    const ubicaciones = [...new Set(this.noticias
      .map(n => n.ubicacion)
      .filter(ubicacion => ubicacion !== undefined))]
      .sort();
    this.ubicacionesDisponibles = ['Todas', ...ubicaciones];
  }

  // Métodos para obtener conteos de noticias
  getNoticiasPorPrioridad(prioridad: string): number {
    return this.noticias.filter(noticia => noticia.prioridad === prioridad).length;
  }

  getNoticiasPorCategoria(categoria: string): number {
    return this.noticias.filter(noticia => noticia.categoria === categoria).length;
  }

  getNoticiasPorConjunto(conjuntoId: string): number {
    return this.noticias.filter(noticia => noticia.conjuntoId === conjuntoId).length;
  }

  getTotalNoticiasCount(): number {
    return this.noticiasFiltradas.length;
  }

  getTotalConjuntosActivos(): number {
    const conjuntosConNoticias = new Set(this.noticias.map(n => n.conjuntoId));
    return conjuntosConNoticias.size;
  }

  // Método para obtener el nombre del conjunto
  getNombreConjunto(conjuntoId: string): string {
    const conjunto = this.conjuntos.find(c => c.id === conjuntoId);
    return conjunto ? conjunto.nombre : 'Conjunto no encontrado';
  }

  // Métodos para íconos y estilos
  getCategoriaIcon(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'Mantenimiento': '',
      'Administración': '',
      'Seguridad': '️',
      'Eventos': '',
      'Todas': ''
    };
    return iconos[categoria] || '';
  }

  getPrioridadClass(prioridad?: string): string {
    switch (prioridad) {
      case 'alta': return 'border-l-4 border-red-500 shadow-red-100';
      case 'media': return 'border-l-4 border-yellow-500 shadow-yellow-100';
      case 'baja': return 'border-l-4 border-green-500 shadow-green-100';
      default: return 'border-l-4 border-blue-300 shadow-blue-50';
    }
  }

  getPrioridadIcon(prioridad?: string): string {
    switch (prioridad) {
      case 'alta': return '';
      case 'media': return '';
      case 'baja': return '';
      default: return '';
    }
  }

  getPrioridadLabel(prioridad?: string): string {
    switch (prioridad) {
      case 'alta': return 'Alta Prioridad';
      case 'media': return 'Prioridad Media';
      case 'baja': return 'Prioridad Baja';
      default: return 'Normal';
    }
  }

  getAlcanceIcon(alcance?: string): string {
    switch (alcance) {
      case 'general': return '';
      case 'torre': return '️';
      case 'zona': return '';
      default: return '';
    }
  }

  getConjuntoIcon(): string {
    return '️';
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  toggleFiltrosAvanzados() {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }

  limpiarFiltros() {
    this.filtros = {
      categoria: 'Todas',
      prioridad: 'Todas',
      alcance: 'Todos',
      ubicacion: 'Todas',
      conjunto: 'Todos',
      busqueda: ''
    };
    this.aplicarFiltros();
  }
}
