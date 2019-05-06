import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class UserResolver implements Resolve<any> {
    constructor(private service: AuthService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Observable((observer) => {
            if (this.service.hasUser) {
                observer.next(this.service.user);
                observer.complete();
                return;
            }
            this.service.currentUserObservable.subscribe((user) => {
                observer.next(user);
                observer.complete();
            });
        });
    }
}

