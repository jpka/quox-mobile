import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabPageModule } from '../tab-page.module';
import { AlertsPage } from './alerts.page';
import { MapModule } from '../map.module';

@NgModule({
  imports: [
    TabPageModule,
    MapModule,
    RouterModule.forChild([{ path: '', component: AlertsPage }])
  ],
  declarations: [AlertsPage]
})
export class AlertsPageModule {}
