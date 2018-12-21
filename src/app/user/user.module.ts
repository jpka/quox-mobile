import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserPage } from './user.page';
import { TabPageModule } from '../tab-page.module';
import { AppFormsModule } from '../forms.module';

@NgModule({
  imports: [
    TabPageModule,
    AppFormsModule,
    RouterModule.forChild([{ path: '', component: UserPage }])
  ],
  declarations: [UserPage]
})
export class UserPageModule {}
