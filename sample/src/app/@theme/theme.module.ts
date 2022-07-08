import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [CommonModule,],
    exports: [CommonModule,],
    declarations: [],
  })
  export class ThemeModule {
    static forRoot(): ModuleWithProviders<ThemeModule> {
      return {
        ngModule: ThemeModule,
        providers: [],
      };
    }
  }