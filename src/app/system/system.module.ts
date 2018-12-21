import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemPage } from './system.page';
import { TabPageModule } from '../tab-page.module';

@NgModule({
  imports: [
    TabPageModule,
    RouterModule.forChild([{ path: '', component: SystemPage }])
  ],
  declarations: [SystemPage]
})
export class SystemPageModule {}
