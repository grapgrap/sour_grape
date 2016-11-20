import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { GameDetailComponent } from './game-detail/game-detail.component';
import { MainComponent } from "./main/main.component";
import { AppComponent } from './app.component';
import { SearchResultComponent } from './search-result/search-result.component';


const appRoutes: Routes = [
  { path: '', component: MainComponent  },
  { path: 'game/:title', component: GameDetailComponent },
  { path: 'search/:keyword', component: SearchResultComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GameDetailComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
