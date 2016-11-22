import { Component, OnInit } from '@angular/core';
import {GameService} from "../game.service";
import {Game} from "../game";
import {GameRate} from "../game-rate";
import {GameRateService} from "../game-rate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
  providers: [
    GameService,
    GameRateService
  ]
})
export class GameDetailComponent implements OnInit {
  private game: Game;
  private gameRate: GameRate;

  private title: string;
  private errorMsg: string;

  constructor(
    private gameService: GameService,
    private gameRateService: GameRateService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.splitTitleFromUrl();
    this.getGameByTitle(this.title);
    this.getGameRateByTitle(this.title);
  }

  private getGameByTitle(title: string) {
    this.gameService.getGameByTitle(title)
        .subscribe(
          game => this.game = game[0],
          error => this.errorMsg = error
    );
  }

  private getGameRateByTitle(title: string) {
    this.gameRateService.getGameRateByTitle(title)
      .subscribe(
        gameRate => this.gameRate = gameRate[0],
        error => this.errorMsg = error
      );
  }

  private splitTitleFromUrl(){
    let currentPath = this.router.url;
    let temp: string[] = currentPath.split('/game/');
    this.title = temp[1];
  }

  private getRatePercent(target:number):string {
    let percent:string;
    switch (target) {
      case 1:
        percent = '' + 10;
        break;
      case 2:
        percent = '' + 70;
        break;
      case 3:
        percent = '' + 90;
        break;
      case 4:
        percent = '' + 40;
        break;
      case 5:
        percent = '' + 100;
        break;
    }

    return percent;
  }
}
