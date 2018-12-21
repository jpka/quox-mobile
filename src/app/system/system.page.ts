import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-system',
  templateUrl: './system.page.html',
  styleUrls: ['./system.page.scss'],
})
export class SystemPage implements OnInit {
  settings = [
    {name: "alarmArmed", label: "Sistema de alarma", msg: ["armada", "desarmada"], icon: "locked.svg"},
    {name: "engineCut", label: "Bloqueo del motor", msg: ["activado", "desactivado"], icon: "key.svg"},
    {name: "siren", label: "Sirena de alarma", msg: ["activada", "desactivada"], icon: "speaker.svg"},
    {name: "accelerometerAlarm", label: "Sensor interno alarma", msg: ["activado", "desactivado"], icon: "shape.svg"},
    {name: "auxiliaryAlarm", label: "Salida auxiliar", msg: ["activada", "desactivada"], icon: "webcam.svg"},
    {name: "energySavings", label: "Ahorro de energía", msg: ["super save", "normal save"], icon: "battery2.svg"},
    {name: "maintenanceMode", label: "Modo mantenimiento", msg: ["activado", "desactivado"], icon: "screwdriver.svg"},
    {name: "accidentAlarm", label: "Aviso por accidente", msg: ["activado", "desactivado"], icon: "sos.svg"},
  ];
  settingsState$ = this.user.getDeviceSettings().pipe(map(
    settings => settings || {}
  ));

  constructor(
    private user: UserService
  ) { }

  ngOnInit() {
  }
}
