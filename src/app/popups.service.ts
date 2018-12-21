import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class PopupsService {
  current: HTMLIonLoadingElement | HTMLIonAlertElement;
  alertQueue: HTMLIonAlertElement[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private user: UserService,
    private localNotifications: LocalNotifications,
    private toastCtrl: ToastController
  ) {
  }

  async loading(message = "Aguarde...") {
    // if (this.current) this.current.dismiss();
    const loading = await this.loadingCtrl.create({message: message});
    this.current = loading;
    loading.present();
    return loading;
  }

  async alert(options) {
    // if (this.current) this.current.dismiss();
    const alert = await this.alertCtrl.create(Object.assign({buttons: ["OK"], className: "popup-alert"}, options));

    // alert.onDidDismiss().then(() => {
    //   console.log("tried to dismiss");
    //   if (this.alertQueue.length > 0) {
    //     console.log("dismissed");
    //     setTimeout(() => {
    //       console.log("tried to present");
    //       this.alertQueue.shift();
    //       if (this.alertQueue.length > 0) {
    //         this.alertQueue[0].present();
    //       }
    //     }, 1000);
    //   }
    // });


    // this.alertQueue.push(alert);
    if (this.current) {
      await this.current.dismiss();
    }
    this.current = alert;

    // if (this.alertQueue.length === 1) {
      await alert.present();
    // }
    return alert;
  }

  async toast(msg, options: any = {}) {
    const toast = await this.toastCtrl.create(Object.assign({
      message: msg,
      showCloseButton: true,
      position: "top",
      closeButtonText: "X",
      // duration: 3000
      mode: "ios"
    }, options));
    await toast.present();
    return toast;
  }

  async info(message) {
    return this.toast(message, {duration: 3000});
  }

  async error(message) {
    // return this.alert({
    //   message: message,
    //   mode: "ios",
    //   buttons: false
    // });
    return this.toast(message, {color: "danger"});
  }

  async success(message) {
    return this.toast(message, {color: "success", duration: 3000});
  }

  async notification(title, message, cb = undefined) {
    // const vehicle = await this.user.getCurrentVehicle().pipe(take(1)).toPromise();
    const alert = await this.alert({
      cssClass: "notification",
      // message: `<h2><span style="width:10px;height:10px;background-color:blue;"></span>NOTIFICACIÓN DE QUOX</h2><div>${message}</div><div style="font-size: 12px">${vehicle.name || vehicle.imei}</div>`,
      message: `
        <div class="header" onclick="notificationClicked()">
          <span class="title">NOTIFICACIÓN DE QUOX</span>
          <span class="time">now</span>
        </div>
        <div class="body" onclick="notificationClicked()">
          <div class="main">${title}</div>
          <div class="footer">${message}</div>
        </div>`,
      backdropDismiss: true,
      buttons: [],
    });
    window["notificationClicked"] = () => {
      alert.dismiss();
      if (cb) {
        cb();
      }
    };
    return alert;
    // console.log("this happens");
    // console.log(cordova.plugins, cordova.plugins["notification"]);
    // this.localNotifications.schedule({
    //   id: 1,
    //   text: message,
    //   title: "NOTIFICACIÓN DE QUOX"
    // });
    // cordova.plugins["notification"].local.schedule({
    //   title: 'My first notification',
    //   text: 'Thats pretty easy...',
    //   foreground: true
    // });
  }

  // async notification(msg) {
  //   const toast = await this.toastCtrl.create({
  //     message: msg,
  //     showCloseButton: true,
  //     position: "bottom",
  //     closeButtonText: "ver",
  //     duration: 3000
  //   });
  //   return toast.present();
  // }
}
