import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  // { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: '**', redirectTo: 'login' },
  { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
