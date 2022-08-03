import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs/internal/Observable'
import { AuthService } from './auth.service'

@Injectable()
export class AccessGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const requireAuth = route.data.requireAuth || true;
    const requireGuest = route.data.requireGuest || false;

    if (requireAuth && !this.auth.check()) {
      console.log("dans guard");
      this.router.navigateByUrl('auth/login');
    }

    if (requireGuest && this.auth.check()) {
      console.log("dans guard2");
      this.router.navigateByUrl('/');
    }

    return true
  }
}
