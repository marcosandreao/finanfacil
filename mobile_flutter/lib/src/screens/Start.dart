import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_flutter/src/auth/auth.dart';
import 'package:mobile_flutter/src/auth/state.dart';
import 'package:mobile_flutter/src/screens/ListBill.dart';

class HomeScreen extends StatefulWidget {
  static const String routeName = "/";
  @override
  HomeScreenState createState() {
    return new HomeScreenState();
  }
}

class HomeScreenState extends State<HomeScreen> {
  StateModel appState = new StateModel();

  GoogleSignInAccount googleAccount;

  GoogleSignIn googleSignIn = GoogleSignIn(
    scopes: <String>['email'],
  );

  @override
  void initState() {
    super.initState();
    initUser();
  }

  Widget _buildContent() {
    print(appState.isLoading);
    if (appState.isLoading || appState.user == null) {
      return _buildLoadingIndicator();
    }
    return Scaffold(body: new ListBillPage(appState.user.uid));
  }

  Center _buildLoadingIndicator() {
    return Center(
      child: new CircularProgressIndicator(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return _buildContent();
  }

  Future<Null> initUser() async {
    final currentUser = await FirebaseAuth.instance.currentUser();
    if (currentUser != null) {
      setState(() {
        appState.isLoading = false;
        appState.user = currentUser;
      });
      return;
    }
    googleAccount = await getSignedInAccount(googleSignIn);
    await signInWithGoogle();
  }

  Future<Null> signInWithGoogle() async {
    if (googleAccount == null) {
      // Start the sign-in process:
      try {
        googleAccount = await googleSignIn.signIn();
      } catch (error) {
        print(error);
        return null;
      }
    }

    FirebaseUser firebaseUser = await signIntoFirebase(googleAccount);
    appState.user = firebaseUser;
    setState(() {
      appState.isLoading = false;
      appState.user = firebaseUser;
    });
  }
}
