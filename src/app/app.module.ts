import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routes.module';
import {MainModule} from "./main/main.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        AppRoutingModule,
        MainModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
