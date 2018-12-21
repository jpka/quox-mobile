import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.module';
import { SystemPageModule } from '../system/system.module';
import { SettingPageModule } from '../setting/setting.module';
import { MapPageModule } from '../map/map-page.module';
import { RoutesPageModule } from '../routes/routes.module';
import { UserPageModule } from '../user/user.module';
import { VehicleSettingsPageModule } from '../vehicle-settings/vehicle-settings.module';
import { AlertsPageModule } from '../alerts/alerts.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    SystemPageModule,
    SettingPageModule,
    MapPageModule,
    RoutesPageModule,
    UserPageModule,
    VehicleSettingsPageModule,
    AlertsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
