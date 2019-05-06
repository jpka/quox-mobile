import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  state$ = this.user.getDeviceState().pipe(map(state => state || {}));
  internalBattery$ = this.user.getDeviceState("internalBattery").pipe(
    this.utils.or(0)
  );
  vehicleBattery$ = this.user.getDeviceState("vehicleBattery").pipe(
    this.utils.or(0)
  );
  internalBatteryPercent$ = this.user.getDeviceStateDerivedValue("internalBatteryPercent").pipe(
    this.utils.or(0)
  );
  vehicleBatteryPercent$ = this.user.getDeviceStateDerivedValue("vehicleBatteryPercent").pipe(
    this.utils.or(0)
  );
  accelerometerSensPercent$ = this.user.getDeviceStateDerivedValue("accelerometerSensPercent").pipe(
    this.utils.or(0)
  );
  alarmCount$ = this.user.getUnreadAlarmCount();

  constructor(
    private user: UserService,
    private utils: UtilsService,
    private navCtrl: NavController
  ) {
    this.state$.subscribe((state: any) => {
      // console.log(state);
    });
  }

  any(group) {
    return group && Object.keys(group).some(key => group[key]);
  }
}
