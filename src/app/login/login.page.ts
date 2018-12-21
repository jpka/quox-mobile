import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { PopupsService } from '../popups.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(EntryFormComponent) formComponent: EntryFormComponent;
  form: FormGroup;
  validationMessages = {
    email: [
       {type: "user-not-found", msg: "El usuario no existe"},
       {type: "unverified-email", msg: "La dirección de correo no está verificada. Verifíquela para continuar."},
       {type: "disabled-user", msg: "El usuario se encuentra deshabilitado"}
    ],
    password: [
       {type: "wrong-password", msg: "La contraseña es incorrecta"},
    ]
  };
  loading: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private popups: PopupsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.loading = await this.loadingCtrl.create({
      message: "Aguarde..."
    });
    await this.loading.present();
    await this.afAuth.auth.signInWithEmailAndPassword(this.form.get('email').value, this.form.get('password').value)
      .then(res => {
        this.navCtrl.navigateForward("/tabs/(home:home)").then(success => {
          if (!success) {
            if (!res.user.emailVerified) {
              this.popups.error("La dirección de correo no está verificada. Verifíquela antes de continuar");
              // this.form.controls.email.setErrors({"unverified-email": true});
            } else {
              this.popups.error("El usuario se encuentra deshabilitado.");
              // this.form.controls.email.setErrors({"disabled-user": true});
            }
          }
        });
      })
      .catch(err => {
        if (!err) return;
        console.error(err);
        switch (err.code) {
          case "auth/user-not-found":
            this.form.controls.email.setErrors({"user-not-found": true});
            break;
          case "auth/wrong-password":
            this.form.controls.password.setErrors({"wrong-password": true});
            break;
        }
      });
    this.loading.dismiss();
  }
}
