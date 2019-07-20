import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile_flutter/src/models/Installments.dart';
import 'package:mobile_flutter/src/screens/FormBill.dart';

class ListBillPage extends StatefulWidget {
  @override
  ListBillPageState createState() {
    return ListBillPageState();
  }
}

class ListBillPageState extends State<ListBillPage> {
  final CollectionReference installmentsReference =
      Firestore.instance.collection('installments');

  final months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  int month = DateTime.now().month;
  int year = DateTime.now().year;

  DropdownButton<num> buildMonths() {
    var items = new List<DropdownMenuItem<num>>();
    for (num i = 1; i <= 12; i++) {
      items.add(new DropdownMenuItem(
        child: new Text(months[i - 1].substring(0, 3)),
        value: i,
      ));
    }

    return new DropdownButton<num>(
      value: month,
      items: items,
      onChanged: (num value) {
        setState(() {
          month = value;
        });
      },
    );
  }

  DropdownButton<num> buildYears() {
    var items = new List<DropdownMenuItem<num>>();
    final now = DateTime.now().year - 5;
    for (num i = now; i <= now + 10; i++) {
      items.add(new DropdownMenuItem(
        child: new Text(i.toString()),
        value: i,
      ));
    }

    return new DropdownButton<num>(
      value: year,
      items: items,
      onChanged: (num value) {
        setState(() {
          year = value;
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Contas"), actions: <Widget>[
        Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            new Theme(
              child: buildMonths(),
              data: new ThemeData.dark(),
            ),
          ],
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 5.0),
            ),
            new Theme(
              child: buildYears(),
              data: new ThemeData.dark(),
            ),
          ],
        )
      ]),
      body: Center(
        child: Container(
            padding: const EdgeInsets.all(10.0),
            child: StreamBuilder<QuerySnapshot>(
              stream: installmentsReference
                  .where('time_month', isEqualTo: month)
                  .where('time_year', isEqualTo: year)
                  .orderBy('time_day')
                  .snapshots(),
              builder: (BuildContext context,
                  AsyncSnapshot<QuerySnapshot> snapshot) {
                if (snapshot.hasError)
                  return new Text('Error: ${snapshot.error}');
                switch (snapshot.connectionState) {
                  case ConnectionState.waiting:
                    return new Center(child: new CircularProgressIndicator());
                  default:
                    if (snapshot.data.documents.length == 0) {
                      return new Center(child: Text('Sem conta 0/'));
                    }
                    return new ListView(
                      children: snapshot.data.documents
                          .map((DocumentSnapshot document) {
                        return new CustomCard(
                            installment: Installment.fromSnapshot(document));
                      }).toList(),
                    );
                }
              },
            )),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => FormBillPage(
                  id: null,
                  month: this.month,
                  year: this.year,
                ), // O58TVNe5zlEfCR6PbSdy
              ));
          // Scaffold.of(_context).showSnackBar(SnackBar(content: Text("$result")));
        },
        tooltip: 'Add',
        child: Icon(Icons.add),
      ),
    );
  }
}

class CustomCard extends StatelessWidget {
  CustomCard({@required this.installment});

  final Installment installment;
  @override
  Widget build(BuildContext context) {
    return new ListTile(
      title: Text(installment.name),
      subtitle: Text(installment.value.toString()),
      trailing: installment.isPaid
          ? (const Icon(Icons.done_all, color: Colors.blue))
          : (const Icon(Icons.done)),
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  FormBillPage(id: installment.key), // O58TVNe5zlEfCR6PbSdy
            ));
      },
    );
  }
}
