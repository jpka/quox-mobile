import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UtilsService } from '../utils.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from "lodash/fp";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss']
})
export class AlertsPage implements OnInit {
  position$ = this.user.getPosition().pipe(this.utils.or(this.user.defaultMapCenter));
  alarms = [];
  vehicle$ = this.user.getCurrentVehicle();
  selected;
  data = this.dataSvc.alarms;
  center;
  alertKey: string;

  constructor(
    private user: UserService,
    private utils: UtilsService,
    private dataSvc: DataService,
    private route: ActivatedRoute
  ) { }

  processItem(item) {
    let value = item.payload.val();
    return {
      key: item.key,
      type: value.type,
      position: value.data ? {lat: value.data.latitude, lng: value.data.longitude} : null,
      date: (value.data && value.data.date) || item.key
    };
  }

  select(alarm) {
    this.selected = alarm;
    if (alarm.position) {
      this.center = alarm.position;
    }
  }

  formatId(key) {
    return key.replace(/ /g, "");
  }

  ngOnInit() {
    this.user.localState$.currentImei.subscribe(() => {
      this.selected = null;
      this.alarms = [];
    });
    this.position$.subscribe(position => {
      if (!this.center) {
        this.center = position;
      }
    });

    this.user.getAlarmChanges(["child_added", "child_removed"]).subscribe(action => {
      switch (action.type) {
        case "child_added":
          this.alarms.push(action.value);
          if (action.key === this.alertKey) {
            this.select(action.value);
            this.alertKey = null;
            setTimeout(() => location.hash = this.formatId(action.key), 1000);
          }
          break;
        case "child_removed":
          let index = this.alarms.findIndex(alarm => alarm.key === action.key);
          if (index > -1) {
            this.alarms.splice(index, 1);
          }
          break;
      }
    });

    this.route.params.subscribe(params => {
      console.log(params.alert);
      if (params.alert) {
        const index = this.alarms.findIndex(alarm => alarm.key === params.alert);
        if (index > -1) {
          this.select(this.alarms[index]);
        } else {
          this.alertKey = params.alert;
        }
      }
    });

    this.user.markAlarmsAsSeen();
  }
}
