
export interface ConfiguracionSistema {
  id: string;
  nombreConjunto: string;
  direccion: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
}

export interface Conjunto {
  id: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  activo: boolean;
  fechaCreacion: Date;
}

export interface FiltrosNoticiasConjunto {
  categoria?: string;
  prioridad?: string;
  alcance?: string;
  ubicacion?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  conjuntoId?: string;
  incluirGlobales?: boolean;
}
