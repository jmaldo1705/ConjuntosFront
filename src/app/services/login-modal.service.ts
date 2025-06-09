import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  private loginModalSubject = new Subject<void>();

  loginModal$ = this.loginModalSubject.asObservable();

  openLoginModal(): void {
    this.loginModalSubject.next();
  }
}
