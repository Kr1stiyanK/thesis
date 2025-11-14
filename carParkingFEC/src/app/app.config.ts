import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {DataService} from "./service/data.service";
import {AuthGuard} from "./AuthGuard";
import {authInterceptor} from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), DataService, AuthGuard]
};
