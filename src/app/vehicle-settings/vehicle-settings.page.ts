import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { PopupsService } from '../popups.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-vehicle-settings',
  templateUrl: './vehicle-settings.page.html',
  styleUrls: ['./vehicle-settings.page.scss'],
})
export class VehicleSettingsPage implements OnInit {
  vehicle$ = this.user.getCurrentVehicle();
  vehicleName: string;
  updatingName: boolean = false;

  constructor(
    private user: UserService,
    private popups: PopupsService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.vehicle$.subscribe(vehicle => {
      this.vehicleName = vehicle.name;
    });
  }

  async changeImg(event) {
    const loading = await this.popups.loading();

    try {
      await this.user.uploadVehiclePic(event.target.files[0]);
      loading.dismiss();
    } catch(e) {
      loading.dismiss();
      console.error(e);
      this.popups.error("Hubo un error al subir la imagen, intente nuevamente");
    }
  }

  async nameChange() {
    this.updatingName = true;
    try {
      await this.user.updateCurrentVehicle({name: this.vehicleName});
    } catch (e) {
      console.error(e);
      await this.popups.error("Hubo un error al actualizar el nombre, compruebe su conexión"); 
    }
    this.updatingName = false;
  }

  async sendCmd(cmd, label) {
    const loading = await this.popups.loading();
    try {
      await this.user.doDeviceRequest(cmd);
      loading.dismiss();
      this.popups.info("Comando enviado");
    } catch (e) {
      await loading.dismiss();
      this.popups.error(`Hubo un error al enviar el comando de ${label}`);
    }
  }

  ngAfterViewInit() {
    this.utils.fixStyles();
  }
}
