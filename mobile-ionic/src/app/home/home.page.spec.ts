import { TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { Observable } from 'rxjs';

export declare function httpsCallable<T = any, R = any>(name: string): (data: T) => Observable<R>;
describe('HomePage', () => {
  let mockAuthService, mockRouter, mockLoadController;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['googleLogin']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoadController = jasmine.createSpyObj('LoadingController', ['create', 'present', 'dismiss']);

    TestBed.configureTestingModule({});
  });

  it('login true', async () => {
    const promise =  jasmine.createSpyObj('Observable', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    mockLoadController.create = jasmine.createSpy().and.returnValue(promise);
    mockAuthService.googleLogin = jasmine.createSpy().and.returnValue(Promise.resolve(true));
    const service: HomePage = new HomePage(mockRouter, mockAuthService, mockLoadController);

    await service.login();

    expect(mockLoadController.create).toHaveBeenCalled();
    expect(promise.present).toHaveBeenCalled();
    expect(promise.dismiss).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('login false', async () => {
    const promise =  jasmine.createSpyObj('Observable', ['present', 'dismiss']);
    promise.present = jasmine.createSpy().and.returnValue(Promise.resolve());
    mockLoadController.create = jasmine.createSpy().and.returnValue(promise);
    mockAuthService.googleLogin = jasmine.createSpy().and.returnValue(Promise.resolve(false));
    const service: HomePage = new HomePage(mockRouter, mockAuthService, mockLoadController);

    await service.login();

    expect(mockLoadController.create).toHaveBeenCalled();
    expect(promise.present).toHaveBeenCalled();
    expect(promise.dismiss).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

});
