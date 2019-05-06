import { TestBed } from '@angular/core/testing';

import { of, from } from 'rxjs';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService;

  beforeEach(() => {
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['data']);
    mockLoadController = jasmine.createSpyObj('LoadingController', ['create', 'present', 'dismiss']);
    mockDatePickerService = jasmine.createSpyObj('DatePickerService', ['open']);
    mockBillService = jasmine.createSpyObj('BillService', ['open']);

    const promise = jasmine.createSpyObj('Observable', ['subscribe']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.pipe = jasmine.createSpy().and.returnValue(Promise.resolve([]));
    mockActivatedRoute.data = promise;


    TestBed.configureTestingModule({});
  });

  it('ngOnInit new', async () => {

    const paramMap = jasmine.createSpyObj('ParamMap', ['has']);
    paramMap.has = jasmine.createSpy().and.returnValue(false);
    mockActivatedRoute.snapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['paramMap']);
    mockActivatedRoute.snapshot.paramMap = paramMap;
    mockActivatedRoute.snapshot.params = {
      month: 10,
      year: 2012
    };
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);

    service.ngOnInit();

    expect(paramMap.has).toHaveBeenCalledWith('id');
    expect(service.isEditMode).toEqual(false);

  });


  it('ngOnInit edit', async () => {
    const createdAt = new Date();
    const mockDate = jasmine.createSpyObj('any', ['toDate']);
    mockDate.toDate = jasmine.createSpy().and.returnValue(createdAt);
    const itemEdit = {
      created_at: mockDate,
      paid: true,
      value: 585,
      bill: {
        name: 'name bill'
      },
      uid: ''
    };
    const subscription = jasmine.createSpyObj('Observable', ['subscribe']);
    subscription.subscribe = jasmine.createSpy().and.callFake((callback) => {
      callback({ user: { uid: 1 }, data: itemEdit });
    });
    mockActivatedRoute.data = subscription;
    mockActivatedRoute.snapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['paramMap']);
    const paramMap = jasmine.createSpyObj('ParamMap', ['has']);
    paramMap.has = jasmine.createSpy().and.returnValue(true);
    mockActivatedRoute.snapshot.paramMap = paramMap;
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);

    service.ngOnInit();

    expect(subscription.subscribe).toHaveBeenCalled();
    expect(paramMap.has).toHaveBeenCalledWith('id');
    expect(service.isEditMode).toEqual(true);
    expect(service.formGroup.get('name').value).toEqual(itemEdit.bill.name);
    expect(service.formGroup.get('value').value).toEqual(itemEdit.value);
    expect(service.formGroup.get('is_paid').value).toEqual(itemEdit.paid);

  });

  it('ngOnInit onSubmit new', async () => {
    const formGroup = jasmine.createSpyObj('FormGroup', ['valid', 'get']);
    formGroup.valid = true;
    formGroup.get = jasmine.createSpy().and.callFake((key) => {
      if (key === 'is_repeat') {
        return { value: true };
      }
      if (key === 'is_paid') {
        return { value: true };
      }
      if (key === 'qty_repeat') {
        return { value: 2 };
      }
      if (key === 'name') {
        return { value: 'name' };
      }
      if (key === 'value') {
        return { value: 12 };
      }
    });
    const promise = jasmine.createSpyObj('Promise', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.dismiss = jasmine.createSpy().and.returnValue(true);
    mockLoadController.create = jasmine.createSpy().and.returnValue(Promise.resolve(promise));
    mockBillService.save = jasmine.createSpy().and.callFake((data) => {
      expect(data.installmentCount).toEqual(2);
      expect(data.is_paid).toEqual(true);
      expect(data.name).toEqual('name');
      expect(data.value).toEqual(12);
      return Promise.resolve();
    });
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);
    service.formGroup = formGroup;
    service.isEditMode = false;

    await service.onSubmit();

    expect(promise.present).toHaveBeenCalled();
    expect(mockBillService.save).toHaveBeenCalled();

  });

  it('onSubmit new repeat false', async () => {
    const formGroup = jasmine.createSpyObj('FormGroup', ['valid', 'get']);
    formGroup.valid = true;
    formGroup.get = jasmine.createSpy().and.callFake((key) => {
      if (key === 'is_repeat') {
        return { value: false };
      }
      if (key === 'is_paid') {
        return { value: true };
      }
      if (key === 'qty_repeat') {
        return { value: 2 };
      }
      if (key === 'name') {
        return { value: 'name' };
      }
      if (key === 'value') {
        return { value: 12 };
      }
    });
    const promise = jasmine.createSpyObj('Promise', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.dismiss = jasmine.createSpy().and.returnValue(true);
    mockLoadController.create = jasmine.createSpy().and.returnValue(Promise.resolve(promise));
    mockBillService.save = jasmine.createSpy().and.callFake((data) => {
      expect(data.installmentCount).toEqual(1); // quando repeat false o valor padrão é 1
      expect(data.is_paid).toEqual(true);
      expect(data.name).toEqual('name');
      expect(data.value).toEqual(12);
      return Promise.resolve();
    });
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);
    service.formGroup = formGroup;
    service.isEditMode = false;

    await service.onSubmit();

    expect(mockLoadController.create).toHaveBeenCalled();
    expect(promise.present).toHaveBeenCalled();
    expect(mockBillService.save).toHaveBeenCalled();

  });

  it('update changing name', async () => {
    // ngOnInit
    const createdAt = new Date();
    const mockDate = jasmine.createSpyObj('any', ['toDate']);
    mockDate.toDate = jasmine.createSpy().and.returnValue(createdAt);
    const itemEdit = {
      id: 58,
      created_at: mockDate,
      paid: true,
      value: 585,
      bill: {
        name: 'name bill'
      },
      uid: 12
    };
    const subscription = jasmine.createSpyObj('Observable', ['subscribe']);
    subscription.subscribe = jasmine.createSpy().and.callFake((callback) => {
      callback({ user: { uid: itemEdit.uid }, data: itemEdit });
    });
    mockActivatedRoute.data = subscription;
    mockActivatedRoute.snapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['paramMap']);
    const paramMap = jasmine.createSpyObj('ParamMap', ['has']);
    paramMap.has = jasmine.createSpy().and.returnValue(true);
    mockActivatedRoute.snapshot.paramMap = paramMap;
    // fin ngOnInit
    const formGroup = jasmine.createSpyObj('FormGroup', ['valid', 'get']);
    formGroup.valid = true;
    formGroup.get = jasmine.createSpy().and.callFake((key) => {
      if (key === 'is_paid') {
        return { value: true, setValue: (param) => { } };
      }
      if (key === 'name') {
        return { value: 'name', setValue: (param) => { } };
      }
      if (key === 'value') {
        return { value: 12, setValue: (param) => { } };
      }
      if (key === 'is_repeat') {
        return {
          valueChanges: jasmine.createSpyObj('Observable', ['subscribe'])
        };
      }
      return {
        setValue: (param) => { }
      };
    });
    const promise = jasmine.createSpyObj('Promise', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.dismiss = jasmine.createSpy().and.returnValue(true);
    mockLoadController.create = jasmine.createSpy().and.returnValue(Promise.resolve(promise));
    mockBillService.update = jasmine.createSpy().and.callFake((data) => {
      expect(data.paid).toEqual(true);
      expect(data.name).toEqual('name');
      expect(data.value).toEqual(12);
      expect(data.id).toEqual(58);
      return Promise.resolve();
    });
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);
    service.formGroup = formGroup;
    service.isEditMode = true;
    service.ngOnInit();

    await service.onSubmit();

    expect(mockLoadController.create).toHaveBeenCalled();
    expect(promise.present).toHaveBeenCalled();
    expect(mockBillService.update).toHaveBeenCalled();

  });

  it('update egual name', async () => {
    // ngOnInit
    const createdAt = new Date();
    const mockDate = jasmine.createSpyObj('any', ['toDate']);
    mockDate.toDate = jasmine.createSpy().and.returnValue(createdAt);
    const itemEdit = {
      id: 58,
      created_at: mockDate,
      paid: true,
      value: 585,
      bill: {
        name: 'name bill'
      },
      uid: 12
    };
    const subscription = jasmine.createSpyObj('Observable', ['subscribe']);
    subscription.subscribe = jasmine.createSpy().and.callFake((callback) => {
      callback({ user: { uid: itemEdit.uid }, data: itemEdit });
    });
    mockActivatedRoute.data = subscription;
    mockActivatedRoute.snapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['paramMap']);
    const paramMap = jasmine.createSpyObj('ParamMap', ['has']);
    paramMap.has = jasmine.createSpy().and.returnValue(true);
    mockActivatedRoute.snapshot.paramMap = paramMap;
    // fin ngOnInit
    const formGroup = jasmine.createSpyObj('FormGroup', ['valid', 'get']);
    formGroup.valid = true;
    formGroup.get = jasmine.createSpy().and.callFake((key) => {
      if (key === 'is_paid') {
        return { value: true, setValue: (param) => { } };
      }
      if (key === 'name') {
        return { value: 'name bill', setValue: (param) => { } };
      }
      if (key === 'value') {
        return { value: 12, setValue: (param) => { } };
      }
      if (key === 'is_repeat') {
        return {
          valueChanges: jasmine.createSpyObj('Observable', ['subscribe'])
        };
      }
      return {
        setValue: (param) => { }
      };
    });
    const promise = jasmine.createSpyObj('Promise', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    promise.dismiss = jasmine.createSpy().and.returnValue(true);
    mockLoadController.create = jasmine.createSpy().and.returnValue(Promise.resolve(promise));
    mockBillService.update = jasmine.createSpy().and.callFake((data) => {
      expect(data.paid).toEqual(true);
      expect(data.name).toEqual('name bill');
      expect(data.value).toEqual(12);
      return Promise.resolve();
    });
    const service: FormComponent = new FormComponent(mockActivatedRoute, mockLoadController, mockDatePickerService, mockBillService);
    service.formGroup = formGroup;
    service.isEditMode = true;
    service.ngOnInit();

    await service.onSubmit();

    expect(mockLoadController.create).toHaveBeenCalled();
    expect(promise.present).toHaveBeenCalled();
    expect(mockBillService.update).toHaveBeenCalled();

  });
});
