import {mergeApplicationConfig, ApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {appConfig} from './app.config';
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

const serverConfig: ApplicationConfig = {
  providers: [
    //provideServerRendering(),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
