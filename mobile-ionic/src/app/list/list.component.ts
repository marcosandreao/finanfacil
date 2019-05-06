import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DateUtil } from 'src/app/common/date-util';
import { DatePickerService } from 'src/app/services/date-picker.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  private installmentCollection: AngularFirestoreCollection<any>;

  public filter: any;

  isLoading = true;
  items$: any;
  private dateUtil = new DateUtil();

  private userId;

  constructor(private db: AngularFirestore,
    public datePickerService: DatePickerService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.data.subscribe(({ user }) => {
      this.userId = user.uid;
    });
  }

  private async load() {
    this.installmentCollection = this.db.collection('installments');

    this.items$ = this.db.collection('installments',
      ref => ref.where('userId', '==', this.userId).orderBy('created_at').startAt(this.filter.start).endAt(this.filter.end))
      .snapshotChanges().pipe(
        map((actions) => actions.map(a => {
          const data = a.payload.doc.data() as any;
          let id = a.payload.doc.id;
          const item = { id, ...data };
          item.billId = data.billRef.id;

          data.billRef.get().then((billSnap) => {
            const billData = billSnap.data();
            id = billSnap.id;
            item.bill = { id, ...billData };
          });
          return item;
        }))
      );
  }

  ngOnInit() {
    this.filter = this.dateUtil.getFilterDatetimeCurrentMonth();
    this.load();
  }

  get month() {
    return this.filter.end.getMonth();
  }
  get year() {
    return this.filter.end.getFullYear();
  }
  public onDelete(item) {
    this.installmentCollection.doc(item.id).delete();
  }

  public onPay(item) {
    this.installmentCollection.doc(item.id).update({ paid: true });
  }

  async openPicker() {
    this.datePickerService.open((seleted) => {
      const date = new Date();
      date.setFullYear(seleted.year.value, seleted.month.value);
      this.filter = this.dateUtil.getFilterDatetimeByDate(date);
      this.load();
    }, this.filter.start);
  }

  public onNewBill() {
    this.router.navigate(['/form', { month: this.month, year: this.year }]);
  }

  get filterLabel(): string {
    return this.datePickerService.translateMonth(this.month).concat('/').concat(this.year);
  }
}
