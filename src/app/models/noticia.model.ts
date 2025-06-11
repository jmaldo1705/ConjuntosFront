import type { ConfiguracionSistema, Conjunto, FiltrosNoticiasConjunto } from './shared.model';

export interface Noticia {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
  contenido: string;
  imagen?: string;
  categoria: string;
  ubicacion?: string; // Ubicación específica donde aplica (ej: "Torre A", "Zona Común", "Parqueadero")
  autor?: string; // Quien publicó la noticia
  fechaPublicacion: Date;
  etiquetas?: string[]; // Etiquetas adicionales para filtrado
  prioridad?: 'alta' | 'media' | 'baja';
  alcance?: 'general' | 'torre' | 'zona'; // Alcance de la noticia dentro del conjunto
  conjuntoId: string; // ID del conjunto al que pertenece la noticia
  conjunto?: ConfiguracionSistema; // Información del conjunto (opcional para datos completos)
}

// Re-exportar los tipos
export type { ConfiguracionSistema, Conjunto, FiltrosNoticiasConjunto };
