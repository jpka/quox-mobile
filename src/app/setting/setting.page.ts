import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from "lodash/fp";
import { PopupsService } from '../popups.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  setting: any = {};
  settings: any[] = [
    {
      name: "alarmArmed",
      description: "Cuando el sistema está en estado armado, el dispositivo está en modo monitoreo de seguridad,  cualquier operación ilegal disparará la alarma. Cuando el sistema está en estado desarmado, no se disparará la alarma ni las alertas.",
      toggleLabel: ["Armar sistema", "Desarmar sistema"],
      icons: ["locked.svg", "unlocked.svg"]
    },
    {
      name: "engineCut",
      description: "Comando para detener el vehículo y bloquear el motor en caso de  robo o secuestro. No se debe detener el vehículo cuando esté se encuentre en marcha. Si lo hace recuerde que es bajo su total reponsabilidad.",
      toggleLabel: ["Activar bloqueo motor", "Desactivar bloqueo motor"],
      icons: ["no_key.svg", "key.svg"]
    },
    {
      name: "siren",
      description: "Podemos configurar la sirena para que está activada, por lo tanto, cuando salte la alarma sonará. Con la sirena desactivada, cuando salte la alarma, no sonará pero seguiremos recibiendo las alertas en nuestro dispositivo móvil o en la web.",
      toggleLabel: ["Activar sirena", "Desactivar sirena"],
      icons: ["speaker.svg", "speaker_off.svg"]
    },
    {
      name: "accelerometerAlarm",
      description: "Se puede activar o desactivar el sensor interno de la alarma. acelerómetro de 3 ejes, para que detecte golpes e inclinaciones. La alarma seguirá estando activa con el resto de funciones pero no saltará por este sensor.",
      toggleLabel: ["Activar sensor", "Desactivar sensor"],
      icons: ["shape.svg", "flame_no.svg"],
      extraControls: {accelerometerSensibility: "El rango de sensibilidad del sensor interno está entre 1 y 12, siendo esté último valor el más sensible."}
    },
    {
      name: "auxiliaryAlarm",
      description: "Se puede activar o desactivar la entrada auxiliar de la alarma. donde se puede conectar un sensor opcional externo u otro accesorio. La alarma seguirá estando activa con el resto de funciones pero no saltará por esta entrada.",
      toggleLabel: ["Activar auxiliar", "Desactivar auxiliar"],
      icons: ["webcam.svg", "webcam_no.svg"]
    },
    {
      name: "energySavings",
      description: "El modo Super Save protege la batería del vehículo cuando no lo estamos utilizando más de 4-5 días. El sistema entra en reposo reduciendo hasta 3000% su consumo de energía.",
      toggleLabel: ["Normal Save", "Super Save"],
      icons: ["battery_3.svg", "battery_4.svg"]
    },
    {
      name: "maintenanceMode",
      description: "El modo Super Save protege la batería del vehículo cuando no lo estamos utilizando más de 4-5 días. El sistema entra en reposo reduciendo hasta 3000% su consumo de energíaEl modo mantenimiento deja en reposo todo el sistema para que no se arme o desarme si no lo desactivamos. Es útil en caso de taller o de mantenimiento propio.",
      toggleLabel: ["Normal Save", "Super Save"],
      icons: ["screwdriver.svg", "screwdriver_no.svg"]
    },
    {
      name: "accidentAlarm",
      description: "El sistema integra un acelerómetro de 3D que detecta el movimiento y a la vez sirve para detectar  si se tiene un accidente con el vehículo. Para que se dispare la alerta por accidente debemos de ir a más de 20Km/H con vehículo.",
      toggleLabel: ["Activar alerta accidente", "Desactivar alerta accidente"],
      extraControls: {accelerometerSensibility: "Dependiendo del tipo de conducción y de donde esté situado el dispositivo es posible que se deba regular el sensor para la alerta por accidente. El rango de sensibilidad del sensor interno está entre 1 y 12, siendo esté último valor el más sensible."},
      icons: ["sos.svg", "no_sos.svg"]
    }
  ];
  params$ = this.route.params;
  inverseToggle: {[key: string]: boolean} = {};
  form: FormGroup = new FormGroup({});
  currentSettings = {};

  constructor(
    private route: ActivatedRoute,
    private user: UserService,
    private fb: FormBuilder,
    private popups: PopupsService
  ) { }

  setFormValue(key, value) {
    this.form.get(key).setValue(value, {emitEvent: false});
    this.currentSettings[key] = value;

    if (typeof value === "boolean") {
      this.inverseToggle[key] = !value;
    }
  }

  resetForm() {
    Object.keys(this.currentSettings).forEach(key => {
      this.setFormValue(key, this.currentSettings[key]);
    });
  }

  ngOnInit() {
    let outstandingChanges = {};
    this.settings.concat({name: "accelerometerSensibility"}).forEach(setting => {
      this.form.addControl(setting.name, new FormControl());
      this.form.get(setting.name).valueChanges.subscribe(value => {
        console.log("form changed", setting.name, value);
        outstandingChanges[setting.name] = true;
      });
      this.user.getDeviceState(setting.name).subscribe(value => {
        console.log("state changed", setting.name, value);
        let msg = "";
        if (outstandingChanges[setting.name]) {
          switch (setting.name) {
            case "alarmArmed":
              msg = value ? "Armado activado" : "Armado desactivado";
              break;
            case "energySavings":
              msg = value ? "Ahorro activado" : "Ahorro desactivado";
              break;
            case "engineCut":
              msg = value ? "Corte de motor activado" : "Corte de motor desactivado";
              break;
            case "siren":
              msg = value ? "Sirena activada" : "Sirena desactivada";
              break;
            case "accelerometerSensibility":
              msg = "Sensibilidad de acelerómetro configurada";
          }
          this.popups.success(msg);
          outstandingChanges[setting.name] = false;
        }
      });
      this.user.getDeviceSettings(setting.name).subscribe(value => this.setFormValue(setting.name, value));
    });

    this.params$.subscribe(
      ({setting}) => this.setting = this.settings.find(s => s.name === setting)
    );

    this.user.setDeviceSettings(this.form.valueChanges).subscribe(async (update: Promise<any>) => {
      console.log("settings updated");
      const loading = await this.popups.loading();

      try {
        await update;
        loading.dismiss();
        this.popups.info("Comando enviado");
      } catch (e) {
        loading.dismiss();
        this.resetForm();
        this.popups.error("No se pudo enviar el comando. Revise su conexión en intente nuevamente");
      }
    });
  }
}
