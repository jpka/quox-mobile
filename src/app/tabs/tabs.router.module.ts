import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { SystemPage } from '../system/system.page';
import { SettingPage } from '../setting/setting.page';
import { MapPage } from '../map/map.page';
import { RoutesPage } from '../routes/routes.page';
import { UserPage } from '../user/user.page';
import { VehicleSettingsPage } from '../vehicle-settings/vehicle-settings.page';
import { AlertsPage } from '../alerts/alerts.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'system',
        outlet: 'system',
        component: SystemPage
      },
      {
        path: 'map',
        outlet: 'map',
        component: MapPage
      },
      {
        path: 'routes',
        outlet: 'routes',
        component: RoutesPage
      },
      {
        path: 'settings/:setting',
        outlet: 'settings',
        component: SettingPage
      },
      {
        path: 'vehicle-settings',
        outlet: 'vehicle-settings',
        component: VehicleSettingsPage
      },
      {
        path: 'user',
        outlet: 'user',
        component: UserPage
      },
      {
        path: 'alerts',
        outlet: 'alerts',
        component: AlertsPage
      },
      {
        path: 'alerts/:alert',
        outlet: 'alerts',
        component: AlertsPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}