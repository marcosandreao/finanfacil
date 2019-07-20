import 'package:cloud_firestore/cloud_firestore.dart';

class Installment {
  String key;
  String name;
  bool isPaid;
  String userId;
  num value;

  Installment(this.name, this.isPaid, this.value);

  Installment.fromSnapshot(DocumentSnapshot snapshot)
      : key = snapshot.documentID,
        name = snapshot["name"],
        isPaid = snapshot["paid"],
        value = snapshot["value"] is String? num.tryParse(snapshot['value']) : snapshot['value'];

  toJson() {
    return {
      "name": name,
      "isPaid": isPaid,
      "value": value,
    };
  }
}
