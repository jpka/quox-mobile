import { HomePage } from './home.page';
import { TabPageModule } from '../tab-page.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    TabPageModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    NgCircleProgressModule.forRoot({
      radius: 43,
      responsive: false,
      outerStrokeWidth: 5,
      innerStrokeWidth: 5,
      space: -5,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      renderOnClick: false,
      showTitle: false,
      showSubtitle: false,
      showUnits: false
    })
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
