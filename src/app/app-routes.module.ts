import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameDetailComponent } from './game-detail/game-detail.component';
import {MainComponent} from "./main/main.component";



const appRoutes: Routes = [
  { path: '', component: MainComponent  },
  { path: 'game/:title', component: GameDetailComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
