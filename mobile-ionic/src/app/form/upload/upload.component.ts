import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent  {

    // Main task
    task: AngularFireUploadTask;

    // Progress monitoring
    percentage: Observable<number>;

    snapshot: Observable<any>;

    // Download URL
    downloadURL: Observable<string>;

    constructor(private storage: AngularFireStorage,
                private db: AngularFirestore,
                private fileChooser: FileChooser,
                private file: File,
                private filePath: FilePath
    ) {
    }


    startUpload(file: any) {

        // The storage path
        const path = `upload/${new Date().getTime()}_${file.name}`;

        // Totally optional metadata
        const customMetadata = {app: 'My AngularFire-powered PWA!'};

        // The main task
        this.task = this.storage.upload(path, file, {customMetadata});

        // Progress monitoring
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges();

        // The file's download URL
        //   this.downloadURL = this.task.downloadURL();
    }

    // Determines if the upload task is active
    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }

    public onFilePicker(): void {
        this.fileChooser.open()
            .then(uri => {
                this.filePath.resolveNativePath(uri)
                    .then(filePath => {
                        this.startUpload(this.dataURItoBlob(filePath));
                    });
            });
            // .catch(e => console.log(e));
    }

    private async dataURItoBlob(dataURI) {

        // convert base64 to raw binary data held in a string
        const byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        const dataView = new DataView(arrayBuffer);
        const blob = new Blob([dataView], { type: mimeString });
        return blob;
    }


}
