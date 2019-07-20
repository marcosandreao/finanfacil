import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormComponent } from './form.component';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import {UploadComponent} from './upload/upload.component';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FormComponent }]),
    ReactiveFormsModule
  ],
  providers: [
    FileChooser,
    File,
    FilePath
  ],
  declarations: [
      FormComponent,
      UploadComponent,
  ]
})
export class FormModule { }
