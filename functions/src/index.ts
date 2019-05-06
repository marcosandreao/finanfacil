import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const installmentRef = admin.firestore().collection('installments');
const billRef = admin.firestore().collection('bills');

exports.createBill = functions.https.onCall(async (data, context) => {
    if (!context || !data) return 1;

    data.created_at = new Date();

    const date = new Date();
    date.setFullYear(data.year, data.month, date.getDate())
    delete data.year;
    delete data.month;
    
    const billDocRef = await billRef.add(data);

    const installments = new Array();
    for (let i = 0; i < data.installmentCount; i++) {
        let isPaid = false;
        if (data.is_paid && i === 0) {
            isPaid = true;
        }
        const obj = {
            created_at: date,
            paid: isPaid,
            paid_at: isPaid ? new Date() : null,
            billRef: billDocRef,
            value: data.value,
            userId: data.userId
        };
        installments.push(obj);

        await installmentRef.add(obj);
        date.setMonth(date.getMonth() + 1);
    }
    console.log(`createBill installments count: ${data.installmentCount} `);

    return 0;
});

exports.updateBill = functions.https.onCall(async (data, context) => {
    if (!context || !data) return 1;

    const docRef = await installmentRef.doc(data.id).get();
    const oldValue: any = {...docRef.data()};
    // caso tenha alterado o nome
    if (data.name) {
        await oldValue.billRef.update({ name: data.name });
    }
    if (oldValue.paid !== data.paid) {
        if (data.paid) {
            data.paid_at = new Date();
        } else {
            data.paid_at = null;
        }
    }
    return docRef.ref.set(data, { merge: true });
});
