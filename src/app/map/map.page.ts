import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  center: any = this.user.defaultMapCenter;
  position;

  constructor(
    private user: UserService
  ) { }

  ngOnInit() {
    this.user.getPosition().pipe(filter(x => x ? true : false)).subscribe(position => {
      this.position = position;
      this.center = position;
    });
  }
}
