import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';

import { EntryModule } from '../entry.module';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EntryModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
