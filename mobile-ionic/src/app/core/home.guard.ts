import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of, } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HomeGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
     return this.auth.currentUserObservable.pipe(
        map(user => {
          if (user === null) {
            return true;
          }
          this.router.navigate(['/list']);
          return false;
        }),
        catchError((err) => {
          return of(true);
        })
      );
  }
}
