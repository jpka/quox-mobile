import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { EntryModule } from '../entry.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EntryModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
