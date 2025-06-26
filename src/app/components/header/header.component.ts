import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isUserMenuOpen = false;
  isDarkMode = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    // Detectar preferencia de tema del sistema
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        this.isDarkMode = prefersDark;
      }

      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }

  // Cerrar menú al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isUserMenuOpen) {
      const target = event.target as HTMLElement;
      const userMenuContainer = document.querySelector('.user-menu-container');

      if (userMenuContainer && !userMenuContainer.contains(target)) {
        this.closeUserMenu();
      }
    }
  }

  // Manejar tecla Escape
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isUserMenuOpen) {
      this.closeUserMenu();
    }
  }

  // Prevenir scroll cuando el menú está abierto en móviles
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.isUserMenuOpen) {
      document.body.style.overflow = '';
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;

    // En móviles, prevenir scroll del body cuando el menú está abierto
    if (window.innerWidth <= 768) {
      if (this.isUserMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Feedback visual al cambiar tema
    const btn = event?.target as HTMLElement;
    if (btn) {
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    }
  }

  toggleMobileSidebar(): void {
    this.sidebarService.toggleSidebar();

    // Feedback táctil
    const btn = event?.target as HTMLElement;
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 100);
    }
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getUserName(): string {
    return 'Juan Díaz';
  }

  logout(): void {
    this.closeUserMenu();

    // Pequeño delay para que se vea la animación de cierre
    setTimeout(() => {
      this.authService.logout();
    }, 200);
  }
}
