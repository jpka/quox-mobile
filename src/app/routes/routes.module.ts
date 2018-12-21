import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoutesPage } from './routes.page';
import { MapModule } from '../map.module';
import { TabPageModule } from '../tab-page.module';

@NgModule({
  imports: [
    TabPageModule,
    MapModule,
    RouterModule.forChild([{ path: '', component: RoutesPage }])
  ],
  declarations: [RoutesPage]
})
export class RoutesPageModule {}
