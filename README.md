# RUN finanfacil

## 1 Firebase Functions
### 1.1 [Funcitons setup and deploy](https://firebase.google.com/docs/functions/get-started)
```shell
npm install -g firebase-tools
firebase deploy --only functions
```

## 2 ./mobile-ionic setup
### 2.1 Add Firebase config to environments variable

Open `/src/environments/environment.ts` and add your Firebase configuration. You can find your project configuration in [the Firebase Console](https://console.firebase.google.com). From the project overview page, click **Add Firebase to your web app**.

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
  }
};
```
### 2.2 [Google Plus Plugin Setup](https://ionicframework.com/docs/native/google-plus)
### 2.3 [IONIC setup and run](https://ionicframework.com/docs/installation/cli) 
```shell
  npm install -g cordova ionic #install ionic
  npm install  # install dependencies
  ionic serve # run on browser
  ionic run android  # run on Android
  ```
