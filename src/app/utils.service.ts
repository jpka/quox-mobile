import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PopupsService } from './popups.service';
import { UserService } from './user.service';
import { ThenableReference } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  connected$ = this.user.getDeviceState("connected");

  constructor(
    private popups: PopupsService,
    private user: UserService
  ) { }

  or(alternative) {
    return (source: Observable<any>) => source.pipe(map(value => value || alternative));
  }

  fixStyles() {
    setTimeout(() => {
      const inputs = document.querySelectorAll("ion-input"); 
      for (let i = 0; i < inputs.length; i++) {
        const style = document.createElement("style");
        style.innerHTML += ".native-input { min-width: 0 !important; height: 22px; }";
        inputs[i]["shadowRoot"]["prepend"](style);
      }
    });
  }

  async handleRequest(request: Promise<any> | ThenableReference, opts: {
    sentMsg?: string,
    disconnectedMsg?: string,
    errorMsg?: string
  } = {}) {
    const loading = await this.popups.loading();

    try {
      await request;
      await loading.dismiss();
      this.connected$.pipe(take(1)).toPromise().then(connected => {
        if (connected) {
          this.popups.info(opts.sentMsg || "Comando enviado");
        } else {
          this.popups.info(opts.disconnectedMsg || "Dispositivo desconectado. El comando será enviado cuando el dispositivo reconecte.");
        }
      });
      return true;
    } catch (e) {
      await loading.dismiss();
      this.popups.error(opts.errorMsg || "No se pudo enviar el comando. Revise su conexión e intente nuevamente");
      return false;
    }
  }
}
