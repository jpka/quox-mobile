import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private navCtrl: NavController
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve, reject) => {
      this.userService.isValid().subscribe(isValid => {
        if (isValid) {
          // this.userService.setActiveImei().then(() => resolve(true));
          resolve(true);
        } else {
          this.navCtrl.navigateRoot("login");
          resolve(false);
        }
      });
    });
  }
}
