import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingPage } from './setting.page';
import { TabPageModule } from '../tab-page.module';
import { AppFormsModule } from '../forms.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    AppFormsModule,
    FormsModule,
    TabPageModule,
    RouterModule.forChild([{ path: '', component: SettingPage }])
  ],
  declarations: [SettingPage]
})
export class SettingPageModule {}
