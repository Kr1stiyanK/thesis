import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {importProvidersFrom} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {DayPilotModule, DayPilotSchedulerComponent} from "daypilot-pro-angular";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    importProvidersFrom(ReactiveFormsModule, BrowserAnimationsModule, MatTableModule, MatDialogModule), provideHttpClient(), {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }]
};
