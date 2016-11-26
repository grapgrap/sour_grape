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


const appRoutes: Routes = [
  { path: '', component: MainComponent  },
  { path: 'game/:title', component: GameDetailComponent },
  { path: 'search/:keyword', component: SearchResultComponent },
  { path: 'game-rank-more', component: GameRankMoreComponent },
  { path: 'mypage', component: MypageComponent },
  { path: 'game-rate', component: MypageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GameDetailComponent,
    SearchResultComponent,
    GameRankMoreComponent,
    MypageComponent
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
