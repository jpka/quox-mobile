import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationMsgComponent } from './validation-msg/validation-msg.component';
import { AppCommonModule } from './common.module';

@NgModule({
  imports: [
    AppCommonModule,
    ReactiveFormsModule
  ],
  declarations: [ValidationMsgComponent],
  exports: [
    ReactiveFormsModule, 
    ValidationMsgComponent
  ]
})
export class AppFormsModule {}
