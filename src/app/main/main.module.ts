import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import {GameDetailComponent} from "../game-detail/game-detail.component";
import {GameService} from "../game.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MainComponent,
    GameDetailComponent
  ],
  providers: [
    GameService
  ]
})
export class MainModule { }
