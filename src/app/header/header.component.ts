import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { UserService } from '../user.service';
import { map, tap, startWith } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { PopupsService } from '../popups.service';

moment.locale('es', {
  relativeTime : {
      future : 'en %s',
      past : 'hace %s',
      s : 'unos segundos',
      ss : '%d segundos',
      m : 'un minuto',
      mm : '%d minutos',
      h : 'una hora',
      hh : '%d horas',
      d : 'un día',
      dd : '%d días',
      M : 'un mes',
      MM : '%d meses',
      y : 'un año',
      yy : '%d años'
  }
});

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() rounded: boolean = false;
  vehicleName$ = this.user.getCurrentVehicle().pipe(
    map((vehicle: any) =>  vehicle.name || vehicle.imei)
  );
  lastConnection$ = this.user.getDeviceLastConnection().pipe(map(time => time ? moment(time).fromNow() : null));
  gsmSignal$ = this.user.getDeviceState("gsmSignal").pipe(startWith(0), this.utils.or(0));
  gpsSignal$ = this.user.getDeviceStateDerivedValue("gpsSignal").pipe(startWith(0), this.utils.or(0));
  reportRequested;
  
  constructor(
    private user: UserService,
    public menuCtrl: MenuController,
    private utils: UtilsService,
    private popups: PopupsService
  ) { }

  ngOnInit() {
    this.user.getReports(["child_added"]).subscribe(() => {
      if (this.reportRequested) {
        this.reportRequested.dismiss();
        this.reportRequested = null;
        this.popups.success("Reporte de estado recibido");
      }
    });
  }

  async requestReport() {
    const loading = await this.popups.loading();
    try {
      await this.user.doDeviceRequest("report request");
      await loading.dismiss();
      this.reportRequested = await this.popups.info("Reporte de estado peticionado");
    } catch (e) {
      await loading.dismiss();
      this.popups.error(`Hubo un error al peticionar el reporte, compruebe su conexión`);
    }
  }
}
