import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './fcm.service';
import { tap } from 'rxjs/operators';
import { PopupsService } from './popups.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private popups: PopupsService,
    private router: Router,
    private user: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.fcm.getToken();

      // // Listen to incoming messages
      // this.fcm.onForegroundMsg().pipe(
      //   tap(msg => {
      //     console.log("notification", msg);
      //     // this.popups.notification(msg);
      //   })
      // ).subscribe();

      // this.fcm.onBackgroundMsg().pipe(
      //   tap(msg => {
      //     console.log("tapped notification", msg);
      //     // this.popups.notification(msg);
      //   })
      // ).subscribe();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === "/tabs/(alerts:alerts)") {
          this.user.markAlarmsAsSeen();
        }
      }
    });
  }
}
