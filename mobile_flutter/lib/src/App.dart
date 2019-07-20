import 'package:flutter/material.dart';
import 'package:mobile_flutter/src/screens/About.dart';
import 'package:mobile_flutter/src/screens/ListBill.dart';

class MainApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ListBillPage(),
      routes: <String, WidgetBuilder>{
        // Set named routes
        AboutPage.routeName: (BuildContext context) => new AboutPage(),
      },
    );
  }
}