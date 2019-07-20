import 'package:flutter/material.dart';
import 'package:mobile_flutter/src/screens/About.dart';
import 'package:mobile_flutter/src/screens/Start.dart';

class MainApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Finan Facíl',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      routes: <String, WidgetBuilder>{
        // Set named routes
        HomeScreen.routeName: (context) => HomeScreen(),
        AboutPage.routeName: (BuildContext context) => new AboutPage(),
      },
    );
  }
}
