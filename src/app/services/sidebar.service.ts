import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal to track sidebar state
  private _sidebarExpanded = signal(true);

  // Getter for the sidebar state
  get sidebarExpanded() {
    return this._sidebarExpanded;
  }

  // Method to toggle sidebar state
  toggleSidebar(): void {
    this._sidebarExpanded.set(!this._sidebarExpanded());
  }
}
