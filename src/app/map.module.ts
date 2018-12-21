import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: '***REMOVED***'
    })
  ],
  declarations: [],
  exports: [
    AgmCoreModule
  ]
})
export class MapModule {}
