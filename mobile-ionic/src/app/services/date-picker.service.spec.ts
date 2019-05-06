import { TestBed } from '@angular/core/testing';

import { DatePickerService } from './date-picker.service';

describe('DatePickerService', () => {
  let mockPickerController, mockPromise;

  beforeEach(() => {
    mockPickerController = jasmine.createSpyObj('PickerController', ['create', 'dissmiss', 'getTop']);
    mockPromise = jasmine.createSpyObj('promise', ['present', 'resolve']);
    TestBed.configureTestingModule({});
  });

  it('create current date', async () => {
    const service: DatePickerService = new DatePickerService(mockPickerController);
    mockPickerController.create = jasmine.createSpy().and.returnValue(Promise.resolve(mockPromise));

    await service.open(() => { });

    expect(mockPickerController.create).toHaveBeenCalled();
    expect(mockPickerController.create).toHaveBeenCalledBefore(mockPromise.present);
    expect(mockPromise.present).toHaveBeenCalled();
  });

  it('translateMonth first month', () => {
    const service: DatePickerService = new DatePickerService(mockPickerController);

    const value = service.translateMonth(0);

    expect(value).toEqual('Janeiro');

  });

  it('translateMonth all months', () => {
    const service: DatePickerService = new DatePickerService(mockPickerController);

    for (let i = 0; i < 12; i++ ) {
      const value = service.translateMonth(i);
      expect(value).toBeDefined();
    }
  });
});
