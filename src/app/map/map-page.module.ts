import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapPage } from './map.page';
import { TabPageModule } from '../tab-page.module';
import { MapModule } from '../map.module';

@NgModule({
  imports: [
    TabPageModule,
    MapModule,
    RouterModule.forChild([{ path: '', component: MapPage }]),
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
