import { TestBed } from '@angular/core/testing';

import { BillService } from './bill.service';
import { Observable } from 'rxjs';

export declare function httpsCallable<T = any, R = any>(name: string): (data: T) => Observable<R>;
describe('BillService', () => {
  let mockFunctions;

  beforeEach(() => {
    mockFunctions = jasmine.createSpyObj('AngularFireFunctions', ['httpsCallable']);
    TestBed.configureTestingModule({});
  });

  it('save data', async () => {
    const service: BillService = new BillService(mockFunctions);
    const promise =  jasmine.createSpyObj('Observable', ['toPromise']);
    const pro: any = () => promise;
    mockFunctions.httpsCallable = jasmine.createSpy().and.returnValue(pro);

    await service.save({});

    expect(mockFunctions.httpsCallable).toHaveBeenCalled();
    expect(mockFunctions.httpsCallable).toHaveBeenCalledWith('createBill');
    expect(promise.toPromise).toHaveBeenCalled();
  });

  it('save update', async () => {
    const service: BillService = new BillService(mockFunctions);
    const promise =  jasmine.createSpyObj('Observable', ['toPromise']);
    const pro: any = () => promise;
    mockFunctions.httpsCallable = jasmine.createSpy().and.returnValue(pro);

    await service.update({});

    expect(mockFunctions.httpsCallable).toHaveBeenCalled();
    expect(mockFunctions.httpsCallable).toHaveBeenCalledWith('updateBill');
    expect(promise.toPromise).toHaveBeenCalled();
  });

});
