import { NgModule } from '@angular/core';
import { AppCommonModule } from './common.module';
import { AppFormsModule } from './forms.module';
import { EntryFormComponent } from './entry-form/entry-form.component';

@NgModule({
  imports: [
    AppCommonModule,
    AppFormsModule
  ],
  declarations: [EntryFormComponent],
  exports: [
    AppCommonModule,
    AppFormsModule,
    EntryFormComponent
  ]
})
export class EntryModule {}
