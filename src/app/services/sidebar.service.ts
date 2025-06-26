import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal to track sidebar state - inicializar basado en el tamaño de pantalla
  private _sidebarExpanded = signal(this.getInitialSidebarState());

  // Getter for the sidebar state
  get sidebarExpanded() {
    return this._sidebarExpanded;
  }

  // Method to toggle sidebar state
  toggleSidebar(): void {
    this._sidebarExpanded.set(!this._sidebarExpanded());
  }

  // detectar si es móvil y establecer estado inicial
  private getInitialSidebarState(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // lg breakpoint - expandido solo en desktop
    }
    return false; // Por defecto colapsado en SSR
  }

  // cerrar sidebar en móviles
  closeSidebarOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this._sidebarExpanded.set(false);
    }
  }
}
