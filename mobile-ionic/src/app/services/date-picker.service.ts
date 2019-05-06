import { Injectable } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {

  private months = new Array('Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');

  constructor(private pickerCtrl: PickerController) { }

  private buildMonth(date: Date) {
    const items = new Array<any>();
    let selectedIndex = 0;
    for (let i = 0; i < this.months.length; i++) {
      items.push({
        text: this.months[i],
        value: i,
      });
      if (date.getMonth() === i) {
        selectedIndex = i;
      }
    }
    return {
      name: 'month',
      options: items,
      selectedIndex: selectedIndex
    };
  }

  private buildYear(date: Date) {
    const today = new Date().getFullYear();
    let i = today - 10;
    const years = new Array<any>();
    let selectedIndex = 0;
    let index = 0;
    for (i; i < today + 10; i++ , index++) {
      years.push({
        text: i,
        value: i
      });
      if (date.getFullYear() === i) {
        selectedIndex = index;
      }
    }
    return {
      name: 'year',
      options: years,
      selectedIndex: selectedIndex
    };
  }

  async open(onSelected: any, date = new Date()) {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Selecionar',
        handler: onSelected
      }],
      columns: [
        this.buildMonth(date),
        this.buildYear(date),
      ]
    });
    await picker.present();
  }

  public translateMonth(month: number): string {
    return this.months[month];
  }
}
