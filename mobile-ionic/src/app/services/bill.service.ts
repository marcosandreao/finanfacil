import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private fns: AngularFireFunctions) { }

  public save(data: any): Promise<any> {
    const callable = this.fns.httpsCallable('createBill');
    return callable(data).toPromise();
  }

  public update(data: any): Promise<any> {
    const callable = this.fns.httpsCallable('updateBill');
    return callable(data).toPromise();
  }
}
