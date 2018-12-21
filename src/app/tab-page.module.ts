import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { AppCommonModule } from './common.module';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [HeaderComponent, ProgressBarComponent],
  exports: [
    AppCommonModule,
    HeaderComponent,
    ProgressBarComponent
  ]
})
export class TabPageModule {}
