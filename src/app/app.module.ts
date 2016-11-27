import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { GameDetailComponent } from './game-detail/game-detail.component';
import { MainComponent } from "./main/main.component";
import { AppComponent } from './app.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { GameRankMoreComponent } from './game-rank-more/game-rank-more.component';
import { MypageComponent } from './mypage/mypage.component';
import { GameRateComponent } from './game-rate/game-rate.component';


const appRoutes: Routes = [
  { path: '', component: MainComponent  },
  { path: 'game/:title', component: GameDetailComponent },
  { path: 'search/:keyword', component: SearchResultComponent },
  { path: 'mypage', component: MypageComponent },
  { path: 'game-rank-more', component: GameRankMoreComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GameDetailComponent,
    SearchResultComponent,
    GameRankMoreComponent,
    MypageComponent,
    GameRateComponent
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
