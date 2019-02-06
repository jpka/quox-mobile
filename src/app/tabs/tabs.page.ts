import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { map, take } from 'rxjs/operators';
import { PopupsService } from '../popups.service';
import { DataService } from '../data.service';
import { MenuController, NavController } from '@ionic/angular';
import { FcmService } from '../fcm.service';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  vehicles$ = this.user.getVehicles().pipe(map(vehicles => Object.values(vehicles)));
  localState = this.user.localState;
  userAttrs$ = this.user.getAttrs();

  constructor(
    private user: UserService,
    private popups: PopupsService,
    private dataSvc: DataService,
    public menuCtrl: MenuController,
    private fcm: FcmService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  logout() {
    this.user.logout();
  }

  selectVehicle(vehicle) {
    this.user.setLocalState({currentImei: vehicle.imei});
  }

  ngOnInit() {
    console.log("tabs init");
    let initialRequestResultsReceived = {};
    let initialAlertsReceived = {};
    this.user.localState$.currentImei.subscribe(imei => {
      initialRequestResultsReceived[imei] = false;
      initialAlertsReceived[imei] = false;
    });

    this.user.getDeviceCompletedRequests().subscribe(() => {
      setTimeout(() => {
        initialRequestResultsReceived[this.user.localState.currentImei] = true;
      });
    });
    this.user.getDeviceRequestResult().subscribe(async ({ msg, status }) => {
      if (!initialRequestResultsReceived[this.user.localState.currentImei]) return;
      if (!msg || msg === "") return;
      this.popups[status === "success" ? "success" : "error"](msg);
    });

    this.fcm.initialize();

    this.fcm.onNotification().subscribe(notification => {
    // let i = 0;
    // setInterval(() => {
    //   i++;
    //   if (i > 10) return;
      // let notification = {
      //   title: "Alerta de algo " + i,
      //   message: "Ducati Multiestrada",
      //   additionalData: {
      //     type: "alarm",
      //     alarmKey: "2018-12-19 00:54:07",
      //     foreground: true,
      //     coldstart: false,
      //     imei: "865794035916677"
      //   }
      // };
      const data = notification.additionalData;
      if (!data || !data.type) return;
      console.log("notification", notification);

      const goToAlert = () => {
        if (this.localState.currentImei !== data.imei) {
          this.user.setLocalState({currentImei: data.imei});
        }
        this.navCtrl.navigateForward(`tabs/(alerts:alerts/${data.alarmKey})`, true, {fragment: data.alarmKey.replace(/ /g, "")});
      };

      switch (data.type) {
        case "alarm":
          if (data.foreground) {
            this.popups.notification(notification.title, notification.message, () => goToAlert());
          } else {
            if (data.coldstart) {
              setTimeout(() => {
                goToAlert();
              }, 1000);
            } else {
              goToAlert();
            }
          }
          break;
        default:
          if (data.foreground) {
            this.popups.notification(notification.title, notification.message);
          }
      }
    // }, 5000);
    });
  }
}
