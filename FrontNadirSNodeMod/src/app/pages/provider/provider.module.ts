import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ProviderService } from 'app/services/provider.service';
import { ThemeModule } from '../../@theme/theme.module';
import { ProviderComponent } from './provider.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NbCardModule,
    ThemeModule,
    Ng2SmartTableModule,

  ],
  declarations: [
    ProviderComponent,
  ],
  providers: [ProviderService],

})
export class ProviderModule { }
