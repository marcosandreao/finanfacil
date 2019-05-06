import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    ) { }

  ngOnInit() {
  }

  public async login() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
    });
    await loading.present();
    const isLogged = await this.authService.googleLogin();
    loading.dismiss();
    if (isLogged) {
      this.router.navigate(['/list']);
    } else {
      // show error
    }
  }
}
