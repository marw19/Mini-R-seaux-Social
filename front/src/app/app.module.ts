import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthGuard } from './_guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { ResetPassowrdComponent } from './components/reset-passowrd/reset-passowrd.component';
import { UpdatePassowrdComponent } from './components/update-passowrd/update-passowrd.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NavbarComponent } from './_shared/navbar/navbar.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { EventServiceService } from './_services/event-service.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SortPipe } from './_helpers/sort.pipe';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { HomeComponent } from './components/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InscriptionComponent,
    ResetPassowrdComponent,
    UpdatePassowrdComponent,
    NavbarComponent,
    SortPipe,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiSwitchModule.forRoot({
      color: '#0e309f',
    }),
    HttpClientModule,
    NgbModule,
    AngularEditorModule,
    NgxIntlTelInputModule,
    RecaptchaV3Module,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BrowserAnimationsModule,
    Ng2IziToastModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxFileDropModule,
  ],
  providers: [EventServiceService,AuthGuard,{
    provide :HTTP_INTERCEPTORS,
    useClass :TokenInterceptorService,
    multi:true
  },
  {
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.recaptcha.siteKey,
  },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
