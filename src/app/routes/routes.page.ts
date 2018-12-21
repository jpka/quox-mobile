import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import * as moment from 'moment';
import { take, throttleTime, filter } from 'rxjs/operators';
import { AgmMap } from '@agm/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

registerLocaleData(localeEs, 'es-ES', localeEsExtra);

declare var google: any;

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  @ViewChild(AgmMap) mapComponent: AgmMap;
  map: any;
  route: any;
  routes = [];
  routesIndex: any = {};
  fitBounds = false;
  center: any;
  vehicle$ = this.user.getCurrentVehicle();

  constructor(
    private user: UserService,
  ) { }

  see(route) {
    this.route = route;

    let bounds = new google.maps.LatLngBounds();
    if (route.points.length > 1) {
      bounds.extend(route.points[0]);
      bounds.extend(route.points[Math.floor(route.points.length / 2)]);
      bounds.extend(route.points[route.points.length - 1])
      this.map.panToBounds(bounds);
      this.map.fitBounds(bounds);
      this.center = bounds.getCenter()
      this.map.setCenter(this.center);
    }
  }

  sort() {
    this.routes.sort((a, b) => a.times[0] >= b.times[0] ? 1 : 0);
  }

  processRoute(route) {
    const key = route.key;
    route = route.payload.val();
    const routeTimes = Object.keys(route);
    const points = Object.values(route);

    return {
      key: key,
      points: points,
      times: routeTimes,
      duration: moment.duration(moment(routeTimes[routeTimes.length - 1]).diff(routeTimes[0]))
    };
  }

  getIndex(key) {
    return this.routes.findIndex(route => route.key === key);
  }

  ngOnInit() {
    this.user.localState$.currentImei.subscribe(() => {
      this.routes = [];
      this.center = null;
      this.route = null;

      this.user.getPosition().pipe(take(1)).subscribe(position => {
        if (!this.center) {
          this.center = position || this.user.defaultMapCenter;
        }
      });
    });
    let update = this.user.getRouteChanges(["child_added", "child_changed", "child_removed"]);
    update.pipe(filter(action => action.type === "child_changed")).pipe(throttleTime(15000)).subscribe(action => {
      console.log("child-changed", action);
      const index = this.getIndex(action.key);
      if (index > -1) {
        Object.assign(this.routes[index], this.processRoute(action));
      }
    });
    update.pipe(filter(action => action.type === "child_added")).subscribe(action => {
      console.log("child_added", action);
      this.routes.push(this.processRoute(action));
    });
    update.pipe(filter(action => action.type === "child_removed")).subscribe(action => {
      console.log("child_removed", action);
      const index = this.getIndex(action.key);
      if (index > -1) {
        this.routes.splice(index, 1)
      }
    });

    this.mapComponent.mapReady.subscribe(map => {
      this.map = map;
    });
  }
}
