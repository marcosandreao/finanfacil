import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { LoadingController } from '@ionic/angular';
import { DatePickerService } from '../services/date-picker.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)]),
    value: new FormControl('', Validators.required),
    is_paid: new FormControl(false),
    is_repeat: new FormControl(false),
    qty_repeat: new FormControl(''),
  });

  isAdvancedValue = false;

  public isEditMode = false;
  private installment: any;

  private month: number;
  private year: number;

  private userId: string;

  constructor(private route: ActivatedRoute,
    private loadingController: LoadingController,
    private datePickerService: DatePickerService,
    private billService: BillService) {
  }

  ngOnInit() {
    this.route.data.subscribe(({ user }) => {
      this.userId = user.uid;
    });
    this.formGroup.get('is_repeat').valueChanges.subscribe((isRepeat: boolean) => {
      this.isAdvancedValue = isRepeat;
      const repeatFormValue = this.formGroup.get('qty_repeat');
      if (this.isAdvancedValue) {
        repeatFormValue.setValidators([Validators.required]);
      } else {
        repeatFormValue.clearValidators();
      }
      repeatFormValue.updateValueAndValidity();
    });

    if (this.route.snapshot.paramMap.has('id')) {
      this.load();
    } else {
      this.month = this.route.snapshot.params.month;
      this.year = this.route.snapshot.params.year;
    }
  }

  private load() {
    this.isEditMode = true;

    this.route.data.subscribe(({ data }) => {
      this.installment = data;
      const date = this.installment.created_at.toDate();
      this.month = date.getMonth();
      this.year = date.getFullYear();
      this.formGroup.get('name').setValue(this.installment.bill.name);
      this.formGroup.get('value').setValue(data.value);
      this.formGroup.get('is_paid').setValue(data.paid);
    });
  }

  public onSubmit() {
    if (this.formGroup.valid) {
      if (!this.isEditMode) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  private async update() {
    const data: any = {
      id: this.installment.id,
      value: this.formGroup.get('value').value,
      paid: this.formGroup.get('is_paid').value,
      name: this.installment.bill.name
    };

    if (data.name !== this.formGroup.get('name').value) {
      data.name = this.formGroup.get('name').value;
    }
    const loading = await this.loadingController.create({
      message: 'Atualizando...',
    });
    this.billService.update(data).then((resp: DocumentReference) => {
      history.back();
      loading.dismiss();
    });
    await loading.present();
  }

  private async save() {
    const isRepeat = this.formGroup.get('is_repeat').value;
    const isPaid = this.formGroup.get('is_paid').value;
    let qtyRepeat = this.formGroup.get('qty_repeat').value;
    if (!isRepeat) {
      qtyRepeat = 1;
    }

    const data = {
      name: this.formGroup.get('name').value,
      value: this.formGroup.get('value').value,
      installmentCount: qtyRepeat,
      is_paid: isPaid,
      month: this.month,
      year: this.year,
      userId: this.userId
    };
    const loading = await this.loadingController.create({
      message: 'Criando...',
    });
    this.billService.save(data).then((resp: DocumentReference) => {
      loading.dismiss();
      history.back();
    });
    await loading.present();
  }

  get filterLabel(): string {
    return this.datePickerService.translateMonth(this.month).concat('/').concat(this.year.toString());
  }
}
