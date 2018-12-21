import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
}
