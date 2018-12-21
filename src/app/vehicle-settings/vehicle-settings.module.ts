import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabPageModule } from '../tab-page.module';
import { VehicleSettingsPage } from './vehicle-settings.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    TabPageModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VehicleSettingsPage }])
  ],
  declarations: [VehicleSettingsPage]
})
export class VehicleSettingsPageModule {}
