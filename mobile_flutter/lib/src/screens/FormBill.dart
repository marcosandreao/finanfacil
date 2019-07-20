import 'dart:async';

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile_flutter/src/models/Installments.dart';
import 'package:mobile_flutter/src/models/bill.dart';
import 'package:cloud_functions/cloud_functions.dart';

class FormBillPage extends StatelessWidget {
  static const String routeName = "/about";

  final id;
  final month;
  final year;
  final idUser;

  FormBillPage({@required this.id, this.idUser, this.month, this.year});

  @override
  Widget build(BuildContext context) {
    final isEdit = id != null;
    final appTitle = !isEdit ? 'Nova conta' : 'Editar conta';

    return Scaffold(
      appBar: AppBar(
        title: Text(appTitle),
        leading: IconButton(
          icon: Icon(isEdit ? Icons.close : Icons.arrow_back),
          onPressed: () => Navigator.pop(context, false),
        ),
      ),
      body: FormBill(
        id: id,
        month: month,
        year: year,
        idUser: idUser,
      ),
    );
  }
}

class FormBill extends StatefulWidget {
  final month;
  final year;
  final id;
  final idUser;

  FormBill({@required this.id, this.idUser, this.month, this.year});

  @override
  FormBillState createState() {
    return FormBillState();
  }
}

class FormBillState extends State<FormBill> {
  final _formKey = GlobalKey<FormState>();

  bool isEdit = false;
  bool isRepeat = false;
  Bill bill;

  final nameController = TextEditingController();
  final valueController = TextEditingController();
  final countController = TextEditingController();

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    nameController.dispose();
    valueController.dispose();
    countController.dispose();

    super.dispose();
  }

  @override
  void initState() {
    if (widget.id == null) {
      bill = new Bill();
    } else {
      isEdit = true;
      getInstallment(widget.id).then(setInstallment);
    }
    super.initState();
  }

  setInstallment(Installment value) {
    setState(() {
      nameController.text = value.name;
      valueController.text = value.value.toString();
      bill = new Bill();
      bill.isPaid = value.isPaid;
    });
  }

  static Future<Installment> getInstallment(String key) async {
    Completer<Installment> completer = new Completer<Installment>();

    Firestore.instance
        .collection('installments')
        .document(key)
        .get()
        .then((DocumentSnapshot snapshot) {
      var installment = Installment.fromSnapshot(snapshot);
      completer.complete(installment);
    });

    return completer.future;
  }

  @override
  Widget build(BuildContext context) {
    if (isEdit && bill == null) {
      return new Center(child: new CircularProgressIndicator());
    }
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  TextFormField(
                    controller: nameController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Campo obrigatório';
                      }
                      return null;
                    },
                    decoration: InputDecoration(
                      labelText: 'Nome',
                      hintText: 'Insira o nome',
                    ),
                  ),
                  TextFormField(
                    controller: valueController,
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value.isEmpty || num.tryParse(value) == null) {
                        return 'Campo obrigatório';
                      }
                      return null;
                    },
                    decoration: InputDecoration(
                      labelText: 'Valor',
                      hintText: 'Insira o valor',
                    ),
                  ),
                  Row(
                    children: <Widget>[
                      Text('Pago?'),
                      Checkbox(
                        value: bill.isPaid,
                        onChanged: (bool newValue) {
                          setState(() {
                            bill.isPaid = newValue;
                          });
                        },
                      ),
                    ],
                  ),
                  isEdit
                      ? SizedBox()
                      : Row(
                          children: <Widget>[
                            Text('Repetir?'),
                            Checkbox(
                              value: isRepeat,
                              onChanged: (bool newValue) {
                                setState(() {
                                  isRepeat = newValue;
                                  if (isRepeat) {
                                    countController.text = '';
                                  } else {
                                    countController.text = '1';
                                  }
                                });
                              },
                            ),
                          ],
                        ),
                  isRepeat
                      ? TextFormField(
                          controller: countController,
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value.isEmpty ||
                                num.tryParse(value) == null ||
                                num.tryParse(value) <= 0) {
                              return 'Campo obrigatório';
                            }
                            return null;
                          },
                          decoration: InputDecoration(
                            labelText: 'Quantidade',
                            hintText: 'Insira o valor',
                          ),
                        )
                      : SizedBox()
                ],
              )),
          Padding(
            padding:
                const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
            child: MaterialButton(
              color: Colors.blue,
              textColor: Colors.white,
              onPressed: () {
                if (_formKey.currentState.validate()) {
                  save();
                  Navigator.pop(context, 'Salvo com sucesso');
                }
              },
              child: Text('Submit'),
            ),
          ),
        ],
      ),
    );
  }

  void save() async {
    if (isEdit) {
      final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
        functionName: 'updateBill',
      );
      dynamic data = {
        "id": widget.id,
        "name": nameController.text,
        "value": num.tryParse(valueController.text),
        "paid": bill.isPaid,
      };

      dynamic resp = await callable.call(data);
    } else {
      final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
        functionName: 'createBill',
      );

      dynamic data = {
        "name": nameController.text,
        "value": num.tryParse(valueController.text),
        "installmentCount": isRepeat ? countController.text : 1,
        "is_paid": bill.isPaid,
        "month": widget.month,
        "year": widget.year,
        "userId": widget.idUser
      };

      dynamic resp = await callable.call(data);
    }
  }
}
