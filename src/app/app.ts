import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuGuestComponent } from './components/menu-guest/menu-guest.component';
import { HeaderComponent } from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {AuthService} from './services/auth.service';
import {SidebarService} from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MenuGuestComponent,
    HeaderComponent,
    SidebarComponent
  ],
  styleUrl: './app.css',
  standalone: true
})
export class App {
  constructor(
    public authService: AuthService,
    private readonly sidebarService: SidebarService
  ) {}

  get sidebarExpanded() {
    return this.sidebarService.sidebarExpanded;
  }
}
