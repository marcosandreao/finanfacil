import { TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { Observable } from 'rxjs';

export declare function httpsCallable<T = any, R = any>(name: string): (data: T) => Observable<R>;
describe('ListComponent', () => {
  let mockFirestore, mockRouter, mockDatePickerService, mockActivatedRoute, mockCollection;

  beforeEach(() => {
    mockFirestore = jasmine.createSpyObj('AngularFirestore', ['collection']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDatePickerService = jasmine.createSpyObj('DatePickerService', ['open']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['data']);
    mockCollection = jasmine.createSpyObj('AngularFirestoreCollection', ['snapshotChanges']);
    const promise =  jasmine.createSpyObj('Observable', ['subscribe']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.pipe = jasmine.createSpy().and.returnValue(Promise.resolve([]));
    mockCollection.snapshotChanges = jasmine.createSpy().and.returnValue(promise);
    mockActivatedRoute.data = promise;
    mockFirestore.collection = jasmine.createSpy().and.returnValue(mockCollection);

    TestBed.configureTestingModule({});
  });

  it('construct userId', async () => {
    const promise =  jasmine.createSpyObj('Observable', ['subscribe']);
    promise.subscribe = jasmine.createSpy().and.returnValue(Promise.resolve({userId: 10}));
    mockActivatedRoute.data = promise;

    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);

    expect(promise.subscribe).toHaveBeenCalled();
  });

  it('ngOnInit load empty', async () => {
    const promise =  jasmine.createSpyObj('Observable', ['subscribe', 'pipe']);
    promise.pipe = jasmine.createSpy().and.returnValue(Promise.resolve([]));
    mockCollection.snapshotChanges = jasmine.createSpy().and.returnValue(promise);
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);

    await service.ngOnInit();

    expect(mockFirestore.collection).toHaveBeenCalledTimes(2);
    expect(mockFirestore.collection).toHaveBeenCalledWith('installments');
    expect(promise.pipe).toHaveBeenCalled();

  });

  it('ngOnInit load with value', async () => {

    const dataItem = jasmine.createSpyObj('any', ['billRef']);

    const dockSnapshot = jasmine.createSpyObj('DocumentChange', ['data']);
    dockSnapshot.data = jasmine.createSpy().and.returnValue(dataItem);
    dockSnapshot.id = 100;
    const item =  jasmine.createSpyObj('DocumentChangeAction', ['payload']);
    item.payload = jasmine.createSpy().and.returnValue(dockSnapshot);

    const promise =  jasmine.createSpyObj('Observable', ['subscribe', 'pipe']);
    promise.pipe = jasmine.createSpy().and.returnValue(Promise.resolve([item, item]));
    mockCollection.snapshotChanges = jasmine.createSpy().and.returnValue(promise);
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);

    await service.ngOnInit();
    const items = await service.items$;

    expect(mockFirestore.collection).toHaveBeenCalledTimes(2);
    expect(mockFirestore.collection).toHaveBeenCalledWith('installments');
    expect(promise.pipe).toHaveBeenCalled();
    expect(items.length).toEqual(2);

  });

  it('ngOnInit default filter', async () => {
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    const month = service.month;
    const year = service.year;

    expect(month).toEqual(new Date().getMonth());
    expect(year).toEqual(new Date().getFullYear());

  });

  it('onDelete', async () => {
    const itemDoc = jasmine.createSpyObj('AngularFirestoreDocument', ['delete'] );
    const installmentCollection =  jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    installmentCollection.doc = jasmine.createSpy().and.returnValue(itemDoc);
    mockFirestore.collection = jasmine.createSpy().and.callFake((key, query?) => {
      return !query ? installmentCollection :  mockCollection;
    });
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    service.onDelete({id: 10});

    expect(installmentCollection.doc).toHaveBeenCalled();
    expect(installmentCollection.doc).toHaveBeenCalledWith(10);
    expect(itemDoc.delete).toHaveBeenCalled();
  });

  it('onPay', async () => {
    const itemDoc = jasmine.createSpyObj('AngularFirestoreDocument', ['update'] );
    const installmentCollection =  jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    installmentCollection.doc = jasmine.createSpy().and.returnValue(itemDoc);
    mockFirestore.collection = jasmine.createSpy().and.callFake((key, query?) => {
      return !query ? installmentCollection :  mockCollection;
    });
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    service.onPay({id: 10});

    expect(installmentCollection.doc).toHaveBeenCalled();
    expect(installmentCollection.doc).toHaveBeenCalledWith(10);
    expect(itemDoc.update).toHaveBeenCalled();
    expect(itemDoc.update).toHaveBeenCalledWith({ paid: true });
  });

  it('onNewBill', async () => {
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    service.onNewBill();

    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/form', { month: service.month, year: service.year }]);
  });

  it('filterLabel', async () => {
    mockDatePickerService.translateMonth = jasmine.createSpy().and.returnValue('A');
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    const resp = service.filterLabel;

    expect(mockDatePickerService.translateMonth).toHaveBeenCalledWith(service.month);
    expect(resp).toEqual('A/' + service.year);
  });

  it('openPicker', async () => {
    mockDatePickerService.open = jasmine.createSpy().and.returnValue(Promise.resolve());
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    await service.openPicker();

    expect(mockDatePickerService.open).toHaveBeenCalled();
  });

  it('openPicker selected', async () => {
    const itemDoc = jasmine.createSpyObj('AngularFirestoreDocument', ['update'] );
    const installmentCollection =  jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    installmentCollection.doc = jasmine.createSpy().and.returnValue(itemDoc);
    mockFirestore.collection = jasmine.createSpy().and.callFake((key, query?) => {
      return !query ? installmentCollection :  mockCollection;
    });
    mockDatePickerService.open = jasmine.createSpy().and.callFake((callback, filter) => {
      callback({year: { value: 2000}, month: { value: 5}});
      return Promise.resolve();
    });
    const service: ListComponent = new ListComponent(mockFirestore, mockDatePickerService, mockRouter, mockActivatedRoute);
    service.ngOnInit();

    await service.openPicker();

    expect(mockDatePickerService.open).toHaveBeenCalled();
    expect(service.month).toEqual(5);
    expect(service.year).toEqual(2000);
  });
});
