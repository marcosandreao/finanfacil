import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class FormResolver implements Resolve<any> {
    constructor(private db: AngularFirestore) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Observable((observer) => {
            this.db.doc('installments/' + route.params.id).get().subscribe((doc) => {
                let data = doc.data();
                let id = doc.id;
                const item: any = { id, ...data };
                this.db.doc('bills/' + data.billRef.id).get().subscribe((docBill) => {
                    data = docBill.data();
                    id = docBill.id;
                    item.bill = { id, ...data };

                    observer.next(item);
                    observer.complete();
                });
            });
        });
    }
}

