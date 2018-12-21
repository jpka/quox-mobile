import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterTextComponent } from './footer-text/footer-text.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [FooterTextComponent],
  exports: [
    CommonModule,
    IonicModule,
    FooterTextComponent
  ]
})
export class AppCommonModule {}
