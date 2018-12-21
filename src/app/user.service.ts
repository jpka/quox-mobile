import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, of, Subject, BehaviorSubject } from 'rxjs';
import { map, switchMap, flatMap, take, filter, finalize, withLatestFrom } from 'rxjs/operators';
import { User } from 'firebase';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  localState: any = {};
  localState$ = {
    currentImei: new BehaviorSubject(null)
  };
  // deviceConnected: boolean = false;
  deviceMessages = {
    alarmArmed: [["Armado activado", "Armado desactivado"], "El dispositivo rechazó la orden de armado/desarmado"],
    energySavings: [["Ahorro activado", "Ahorro desactivado"], "El dispositivo rechazó la orden de ahorro de energía"],
    engineCut: [["Corte de motor activado", "Corte de motor desactivado"], "El dispositivo rechazó la orden de corte de motor"],
    siren: [["Sirena activada", "Sirena desactivada"], "El dispositivo rechazó la orden de configuración de sirena"],
    maintenanceMode: [["Modo mantenimiento activado", "Modo mantenimiento desactivado"], "El dispositivo rechazó la orden de configuración de modo mantenimiento"],
    accelerometerSensibility: ["Sensibilidad de acelerómetro configurada", "El dispositivo rechazó la orden de configuración de sensibilidad del acelerómetro"],
    batteryAlarmThreshold: ["Aviso de alarma configurado", "El dispositivo rechazó la orden de configuración de aviso de alarma"],
    partialReset: ["Reseteo parcial exitoso", "El dispositivo rechazó la orden de reseteo parcial"],
    factoryReset: ["Reseteo de fábrica exitoso", "El dispositivo rechazó la orden de reseteo de fábrica"]
  };
  defaultMapCenter = {lat: 39.4699, lng: -0.3763};

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private localStorage: Storage
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      this.user = user;
      this.setLocalState(await this.localStorage.get(user.uid), false);
    });
    this.getImeis().subscribe(imeis => {
      if (!this.localState.currentImei || !imeis.includes(this.localState.currentImei)) {
        this.setLocalState({currentImei: imeis[0]});
      }
    });
    // this.getDeviceState("connected").subscribe((connected: boolean) => {
    //   this.deviceConnected = connected;
    // });
  }

  setLocalState(data, persist = true) {
    if (!data) return;
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (this.localState$[key] && value !== this.localState[key]) {
        this.localState$[key].next(value);
      }
      this.localState[key] = value;
    });
    if (persist) {
      this.localStorage.set(this.user.uid, this.localState);
    }
    console.log("localState", this.localState);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  getImeis() {
    return this.afAuth.user.pipe(
      filter(user => user !== null),
      switchMap(user => this.db.list('/imeis', ref => ref.orderByValue().equalTo(user.uid))
        .snapshotChanges()
        .pipe(
          map(changes => changes.map(c => c.key))
        ))
    );
  }

  getDeviceLastConnection() {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.object(`/devices/${imei}/lastConnection`).valueChanges())
    );
  }

  // getReports() {
  //   return this.getActiveImei().pipe(
  //     switchMap(imei =>
  //       this.db.list(`/reports/${imei}`, ref => ref.orderByKey().limitToLast(1))
  //         .snapshotChanges()
  //         .pipe(
  //           flatMap(changes => changes.map(c => ({
  //             imei: imei,
  //             time: c.key,
  //             data: c.payload.val()
  //           })))
  //         )
  //     )
  //   );
  // }

  getReports(events = undefined) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/reports/${imei}`).stateChanges(events))
    );
  }

  getAttrs() {
    return this.afAuth.user.pipe(
      switchMap(user => user ? this.db.object(`/usersData/${user.uid}`).valueChanges().pipe(map(attrs => Object.assign(attrs, user))) : of(null))
    );
  }

  setAttrs(data, path = '') {
    return this.db.object(`/usersData/${this.afAuth.auth.currentUser.uid}${path}`).update(data);
  }

  updatePassword(pwd) {
    return this.afAuth.auth.currentUser.updatePassword(pwd);
  }

  isValid() {
    return this.afAuth.authState.pipe(
      flatMap(user => {
        if (user && (user.emailVerified || user.email === "demo@bretox.com")) {
          return this.getAttrs().pipe(map((attrs: any) => attrs && attrs.state !== "disabled"));
        } else {
          return of(false);
        }
      })
    );
  }

  settingsRef(imei, key = null) {
    return this.db.object(`/devices/${imei}/settings` + (key ? `/${key}` : ""));
  }

  setDeviceSettings(settings$) {
    return settings$.pipe(
      withLatestFrom(this.localState$.currentImei),
      map(([settings, imei]) => this.settingsRef(imei).update(settings).then(() => settings))
    );
  }

  getDeviceSettings(key = null) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.settingsRef(imei, key).valueChanges())
    );
  }

  getDeviceState(key = null) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.object(`/devices/${imei}/state` + (key ? `/${key}` : '')).valueChanges())
    );
  }


  getDeviceStateDerivedValue(key) {
    switch (key) {
      case "gpsSignal":
        return this.getDeviceState("gpsSatellites").pipe(map(this.calculateGpsSignal));
      case "internalBatteryPercent":
        return this.getDeviceState("internalBattery").pipe(map((value: number) => value * 100 / 4));
      case "vehicleBatteryPercent":
        return this.getDeviceState("vehicleBattery").pipe(map((value: number) => value ? ((value - 3) * 10): 0));
      default:
        return null;
    }
  }

  // getDeviceSettingError() {
  //   return this.getActiveImei().pipe(
  //     switchMap(imei => this.db.object(`/devices/${imei}/settings/error`).valueChanges())
  //   );
  // }

  // getDeviceData(key = null) {
  //   return this.getActiveImei().pipe(
  //     switchMap(imei => this.db.object(`/devices/${imei}` + (key ? `/${key}` : '')).valueChanges())
  //   );
  // }
  calculateGpsSignal(sattelites) {
    return sattelites * 10;
  }

  doDeviceRequest(request) {
    return this.db.list(`/devices/${this.localState.currentImei}/requests/pending`).push(request)
  }

  getDeviceMessage(request, status, value = true) {
    let message = this.deviceMessages[_.camelCase(request)];
    if (!message) return false;
    message = message[status === "success" ? 0 : 1];
    if (Array.isArray(message)) {
      message = message[value !== false ? 0 : 1];
    }
    return message;
  }

  getDeviceCompletedRequests(cb = undefined) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/devices/${imei}/requests/completed`, cb).stateChanges())
    );
  }

  getDeviceRequestResult() {
    return this.getDeviceCompletedRequests().pipe(
      filter(change => change.type === "child_added"),
      map(change => {
        // this.db.object(`/devices/${imei}/requests/completed/${change.key}`).remove();
        let request: any = change.payload.val();
        return {
          msg: this.getDeviceMessage(request.name, request.status),
          status: request.status
        };
      })
    );
  }

  async uploadFile(path, file) {
    path = `/user/${this.user.uid}/${path}`;
    let ref = this.afStorage.ref(path);
    let downloadUrl;
    await this.afStorage.upload(path, file).snapshotChanges().pipe(
      finalize(() => {
        downloadUrl = ref.getDownloadURL();
      })
    ).toPromise();
    return downloadUrl.toPromise();
  }

  async uploadProfilePic(file) {
    const url = await this.uploadFile("profile-pic", file);
    return this.user.updateProfile({
      displayName: null,
      photoURL: url
    }).then(() => url);
  }

  async uploadVehiclePic(file) {
    const imei = this.localState.currentImei;
    return this.db.object(`usersData/${this.user.uid}/vehicles/${imei}/picUrl`).set(
      await this.uploadFile(`vehicles/${imei}/pic`, file)
    );
  }

  defaultVehicle(imei) {
    return { imei: imei, name: null, picUrl: '/assets/images/carImage.jpg' };
  }

  processVehicle(vehicle, imei) {
    return Object.assign({ imei: imei, name: null, picUrl: '/assets/images/carImage.jpg' }, vehicle);
  }

  getCurrentVehicle() {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.object(`/usersData/${this.user.uid}/vehicles/${imei}`).valueChanges()),
      map((vehicle: any) => this.processVehicle(vehicle, this.localState.currentImei))
    );
  }

  updateCurrentVehicle(data) {
    return this.db.object(`/usersData/${this.user.uid}/vehicles/${this.localState.currentImei}`).update(data);
  }

  getVehicles() {
    return combineLatest(
      this.getImeis(),
      this.db.object(`/usersData/${this.user.uid}/vehicles`).valueChanges(),
      (imeis, vehicles) => {
        if (!vehicles) {
          vehicles = {};
        }
        imeis.forEach(imei => {
          vehicles[imei] = this.processVehicle(vehicles[imei], imei);
        });
        return vehicles;
      });
  }

  // async imeiIsAvailable(imei) {
  //   return await this.db.object(`imeis/${imei}`).valueChanges().pipe(take(1)).toPromise() === true;
  // }

  // async addVehicle(data) {
  //   if (await this.imeiIsAvailable(data.imei)) {
  //     await this.db.object(`imeis/${data.imei}`).set(this.user.uid);
  //     return this.db.object(`usersData/${this.user.uid}/vehicles/${data.imei}`).update(_.omit(data, "imei"));
  //   } else {
  //     throw new Error("IMEI is unavailable");
  //   }
  // }

  // updateVehicle(imei, data) {
  //   delete data.imei;
  //   return this.db.object(`usersData/${this.user.uid}/vehicles/${imei}`).update(data);
  // }

  getPosition() {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.object(`/devices/${imei}/state/position`).valueChanges())
    );
  }

  getRoutes(events = undefined, cb = (ref: firebase.database.Reference) => ref.orderByKey()) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/devices/${imei}/routes`, cb).snapshotChanges(events))
    );
  }

  getRouteChanges(events = undefined, cb = (ref: firebase.database.Reference) => ref.orderByKey()) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/devices/${imei}/routes`, cb).stateChanges(events))
    );
  }

  getAlarms(events = undefined) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/devices/${imei}/alarms`, ref => ref.orderByKey()).valueChanges())
    );
  }

  getAlarmChanges(events = undefined) {
    return this.localState$.currentImei.pipe(
      switchMap(imei => this.db.list(`/devices/${imei}/alarms`, ref => ref.orderByKey()).stateChanges(events)),
      map(action => {
        const value: any = action.payload.val();
        return Object.assign({
          value: {
            key: action.key,
            type: value.type,
            position: value.data ? {lat: value.data.latitude, lng: value.data.longitude} : null,
            date: (value.data && value.data.date) || action.key
          }
        }, action);
      })
    );
  }
}
