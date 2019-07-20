import 'package:cloud_firestore/cloud_firestore.dart';

class Bill {
  String key;
  String name;
  bool isPaid = false;
  double value = 0;
  String userId;
  num installmentCount;
  DateTime createdAt = DateTime.now();

  Bill();

  Bill.fromSnapshot(DocumentSnapshot snapshot)
      : key = snapshot.documentID,
        name = snapshot["name"],
        createdAt = snapshot["created_at"],
        isPaid = snapshot["is_paid"],
        userId = snapshot["userId"],
        value = snapshot["value"] is String? num.tryParse(snapshot['value']) : snapshot['value'];

  toJson() {
    return {
      "name": name,
      "isPaid": isPaid,
      "value": value,
      "createdAt": createdAt,
      "userId": userId
    };
  }
}
