import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MenuGuestComponent } from './components/menu-guest/menu-guest.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MenuGuestComponent,
    HeaderComponent
  ],
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit, OnDestroy {
  isWelcomePage = false;

  constructor(
    private readonly router: Router ) {}

  ngOnInit() {
    this.checkCurrentRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isWelcomePage = event.url === '/welcome';
      });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private checkCurrentRoute() {
    this.isWelcomePage = this.router.url === '/welcome';
  }
}
