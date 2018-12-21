import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PopupsService } from '../popups.service';
import { UserService } from '../user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Routes, Router } from '@angular/router';
import { windowToggle } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  emailInUse: string;
  invalidImei: string;
  form = this.fb.group({
    name: this.fb.group({
      first: ['', Validators.required],
      last: ['', Validators.required]
    }),
    email: ['', [Validators.required, Validators.email, (control) => {
      return control.value === this.emailInUse ? {emailInUse: true} : null;
    }]],
    phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    password: new FormGroup({
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
      confirmation: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
    }, (group: any) => {
      const {password, confirmation} = group.controls;

      if (password.value !== "" && confirmation.value !== "" && password.value !== confirmation.value) {
        return {dontMatch: true};
      } else {
        return null;
      }
    }),
    deviceModel: ['', Validators.required],
    imei: [null, [Validators.required, (control) => this.invalidImei === control.value ? {imeiIsInvalid: true}: null]]
  });
  validationMessages = {
    firstName: [],
    lastName: [],
    deviceModel: [],
    phone: [
      {type: "pattern", msg: "El teléfono es inválido"}
    ],
    password: [
      {type: "minlength", msg: "La contraseña debe tener al menos 6 caracteres"}
    ],
    passwordGroup: [
      {type: "dontMatch", msg: "La contraseñas no concuerdan"}
    ],
    imei: [
      {type: "imeiIsInvalid", msg: "El IMEI no está habilitado o ya esta en uso"},
    ],
    email: [
      {type: "email", msg: "La dirección de correo es inválida"},
      {type: "emailInUse", msg: "La dirección de correo esta asociado a una cuenta existente"}
    ]
  };

  constructor(
    private fb: FormBuilder,
    private popups: PopupsService,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
    private navCtrl: NavController
  ) { 
  }

  ngOnInit() {
    Object.keys(this.validationMessages).forEach(key => {
      this.validationMessages[key].push({type: "required", msg: "Este campo no puede estar vacío"});
    });
    console.log(this.validationMessages);
  }

  async submit() {
    const loading = await this.popups.loading();
    const data = this.form.value;
    this.db.object(`imeis/${data.imei}`).set(true).then(() => {
      this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password.password)
        .then(async (res) => {
          let userData = Object.assign({}, data);
          delete userData.imei;
          delete userData.password;
          await this.db.object(`usersData/${res.user.uid}`).set(userData);
          await this.db.object(`imeis/${data.imei}`).set(res.user.uid);
          res.user.sendEmailVerification().then(() => {
            loading.dismiss();
            this.navCtrl.navigateRoot("login");
          }).catch(error => {
            loading.dismiss();
            console.error(error);
            this.navCtrl.navigateRoot("login");
          });
        })
        .catch(error => {
          loading.dismiss()
          console.error("code:", error.code, "message:", error.message);
          if (error.code === "auth/email-already-in-use") {
            this.emailInUse = data.email;
            this.form.controls.email.setErrors({emailInUse: true});
          } else {
            this.popups.error("Ha ocurrido un error, revise sus datos e intentelo nuevamente");
          }
        });  
    }).catch(error => {
      console.error(error);
      loading.dismiss();
      this.invalidImei = data.imei;
      console.log(this.invalidImei);
      this.form.controls.imei.setErrors({imeiIsInvalid: true});
    });
  }
}
