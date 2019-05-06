import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private platform: Platform) {
  }

  get hasUser(): boolean {
    return this.afAuth.auth.currentUser !== null;
  }

  get user(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  get currentUserObservable(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  private googleWebLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
          this.afAuth.auth.signInWithCredential(result.credential).then((user: firebase.User) => {
            resolve(true);
          }).catch(err => {
            // alert('error auth ' + JSON.stringify(err));
            resolve(false);
          });
        });
    });
  }

  private googleNativeLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        'webClientId': environment.firebase.webClientId,
        'offline': true
      })
        .then(res => {
          const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          this.afAuth.auth.signInWithCredential(credential).then((user: firebase.User) => {
            resolve(true);
          }).catch(err => {
            // alert('error auth ' + JSON.stringify(err));
            resolve(false);
          });
        })
        .catch(err => {
          // alert('error login ' + err);
          resolve(false);
        });
    });
  }

  public googleLogin(): Promise<boolean> {
    if (this.platform.is('android')) {
      return this.googleNativeLogin();
    }
    return this.googleWebLogin();
  }
}
