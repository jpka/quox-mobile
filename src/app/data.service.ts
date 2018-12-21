import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  alarms = {
    "accelerometer": {
      label: "sensor de golpes",
      icon: "accelerometer"
    },
    "external battery cut": {
      label: "corte de suministro",
      icon: "no_battery2"
    },
    "external battery low": {
      label: "batería externa",
      icon: "battery2"
    },
    "internal battery low": {
      label: "batería interna",
      icon: "battery_internal2"
    },
    "accident": {
      label: "accidente",
      icon: "accelerometer"
    },
    "DIN1": {
      label: "salida auxiliar",
      icon: "webcam"
    },
    "DIN2": {
      label: "salida auxiliar",
      icon: "webcam"
    }
  };
  
  constructor() { }
}
