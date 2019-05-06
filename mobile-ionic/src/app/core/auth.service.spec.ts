import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let mockAuth, mockGooglePlus, mockPlatform;

  beforeEach(() => {
    mockAuth = jasmine.createSpyObj('AngularFireAuth', ['auth']);
    mockGooglePlus = jasmine.createSpyObj('GooglePlus', ['httpsCallable', 'login']);
    mockPlatform = jasmine.createSpyObj('Platform', ['is']);

    TestBed.configureTestingModule({});
  });

  it('doest have user', async () => {
    mockAuth.auth.currentUser = null;
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const hasUser = service.hasUser;

    expect(hasUser).toEqual(false);
  });

  it('have user', async () => {
    mockAuth.auth.currentUser = {};
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const hasUser = service.hasUser;

    expect(hasUser).toEqual(true);
  });

  it('user', async () => {
    mockAuth.auth.currentUser = {};
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const user = service.user;

    expect(user).toEqual(mockAuth.auth.currentUser);
  });

  it('get authState', async () => {
    mockAuth.authState = {};
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const observable = service.currentUserObservable;

    expect(observable).toEqual(mockAuth.authState);
  });

  it('googleWebLogin resolve true', async () => {
    const objCred = {credential: 'value_cred'};
    mockAuth.auth = jasmine.createSpyObj('FirebaseAuth', ['signInWithPopup', 'signInWithCredential']);
    mockAuth.auth.signInWithPopup = jasmine.createSpy().and.returnValue(Promise.resolve(objCred));
    mockAuth.auth.signInWithCredential = jasmine.createSpy().and.returnValue(Promise.resolve({}));
    mockPlatform.is = jasmine.createSpy().and.returnValue(false);
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const observable = await service.googleLogin();

    expect(observable).toEqual(true);
    expect(mockAuth.auth.signInWithPopup).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalledWith(objCred.credential);

  });


  it('googleWebLogin reject', async () => {
    const objCred = {credential: 'value_cred'};
    mockAuth.auth = jasmine.createSpyObj('FirebaseAuth', ['signInWithPopup', 'signInWithCredential']);
    mockAuth.auth.signInWithPopup = jasmine.createSpy().and.returnValue(Promise.resolve(objCred));
    mockAuth.auth.signInWithCredential = jasmine.createSpy().and.returnValue(Promise.reject({}));
    mockPlatform.is = jasmine.createSpy().and.returnValue(false);
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const observable = await service.googleLogin();

    expect(observable).toEqual(false);
    expect(mockAuth.auth.signInWithPopup).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalledWith(objCred.credential);
  });

  it('googleNativeLogin resolve true', async () => {
    const objToken = {idToken: '000000000000'};
    mockGooglePlus.login = jasmine.createSpy().and.returnValue(Promise.resolve(objToken));
    mockAuth.auth = jasmine.createSpyObj('FirebaseAuth', ['signInWithPopup', 'signInWithCredential']);
    mockAuth.auth.signInWithCredential = jasmine.createSpy().and.returnValue(Promise.resolve({}));
    mockPlatform.is = jasmine.createSpy().and.returnValue(true);
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const observable = await service.googleLogin();

    expect(observable).toEqual(true);
    expect(mockGooglePlus.login).toHaveBeenCalled();
    expect(mockGooglePlus.login).toHaveBeenCalledWith({
      'webClientId': environment.firebase.webClientId,
      'offline': true
    });
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalledWith(firebase.auth.GoogleAuthProvider.credential(objToken.idToken));
  });

  it('googleNativeLogin reject', async () => {
    const objToken = {idToken: '000000000000'};
    mockGooglePlus.login = jasmine.createSpy().and.returnValue(Promise.resolve(objToken));
    mockAuth.auth = jasmine.createSpyObj('FirebaseAuth', ['signInWithPopup', 'signInWithCredential']);
    mockAuth.auth.signInWithCredential = jasmine.createSpy().and.returnValue(Promise.reject({}));
    mockPlatform.is = jasmine.createSpy().and.returnValue(true);
    const service: AuthService = new AuthService(mockAuth, mockGooglePlus, mockPlatform);

    const observable = await service.googleLogin();

    expect(observable).toEqual(false);
    expect(mockGooglePlus.login).toHaveBeenCalled();
    expect(mockGooglePlus.login).toHaveBeenCalledWith({
      'webClientId': environment.firebase.webClientId,
      'offline': true
    });
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalled();
    expect(mockAuth.auth.signInWithCredential).toHaveBeenCalledWith(firebase.auth.GoogleAuthProvider.credential(objToken.idToken));
  });
});
