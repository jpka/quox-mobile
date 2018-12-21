import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash/fp';
import { PopupsService } from '../popups.service';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  form = this.fb.group({
    name: this.fb.group({
      first: ["", Validators.required],
      last: ["", Validators.required]
    }),
    password: ["", Validators.minLength(6)],
    userName: "",
    address: this.fb.group({
      city: "",
      street: ""
    }),
    phone: [null, Validators.pattern("^[0-9]*$")]
  });
  validationMessages = {
    password: [
      {type: "minlength", msg: "La contraseña debe tener al menos 6 caracteres"}
    ]
  };
  userAttrs$ = this.user.getAttrs();
  attrs;

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private popups: PopupsService,
    private router: Router,
    private utils: UtilsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userAttrs$.subscribe(attrs => {
      this.attrs = attrs;
      Object.keys(this.form.value).forEach(key => {
        let value = attrs[key];
        if (value) {
          if (typeof value === "object") {
            value = _.pick(Object.keys(this.form.get(key).value))(value);
          }
          this.form.get(key).setValue(value);
        }
      });
    });
  }

  async update() {
    const loading = await this.popups.loading();

    if (this.form.value.password && this.form.value.password.length > 0) {
      try {
        await this.user.updatePassword(this.form.value.password);
        console.log("updatePassword");
      } catch (error) {
        console.log(error);
        await loading.dismiss();
        if (error.code === "auth/requires-recent-login") {
          await this.popups.error("El cambio de contraseña requiere una autenticación reciente, por favor autentíquese nuevamente para proceder.");
          this.navCtrl.navigateRoot("login");
        } else {
          await this.popups.error("Hubo un error al actualizar la contraseña, intentelo nuevamente");
        }
        return;
      }
    }

    try {
      console.log("updateAttrs");
      await this.user.setAttrs(_.omit("password")(this.form.value));
    } catch (error) {
      await loading.dismiss();
      await this.popups.error("Hubo un error al actualizar los datos, intentelo nuevamente");
    }

    await loading.dismiss();
    this.popups.success("Datos actualizados");
  }

  async changeImg(event) {
    const loading = await this.popups.loading();

    try {
      this.attrs.photoURL = await this.user.uploadProfilePic(event.target.files[0]);
      loading.dismiss();
    } catch(e) {
      loading.dismiss();
      console.error(e);
      this.popups.error("Hubo un error al subir la imagen, intente nuevamente");
    }
  }

  logout() {
    this.user.logout();
  }

  ngAfterViewInit() {
    this.utils.fixStyles();
  }
}
