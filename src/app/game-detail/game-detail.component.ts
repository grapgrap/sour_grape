import { Component, OnInit } from '@angular/core';
import {GameService} from "../service/game.service";
import {Game} from "../model/game";
import {GameRate} from "../model/game-rate";
import {GameRateService} from "../service/game-rate.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {PredictedRateService} from "../service/predicted-rate.service";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
  providers: [
    GameService,
    GameRateService,
    PredictedRateService,
    UserService
  ]
})
export class GameDetailComponent implements OnInit {
  private game: Game;
  private gameRate: GameRate;
  private predictedGameRate: number = -1;
  private currentUserGameRate: number = -1;
  private currentUser: User;

  private title: string;
  private errorMsg: string;

  constructor(
    private gameService: GameService,
    private gameRateService: GameRateService,
    private predictedRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ) {
    let tempUser = new User('0235', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.splitTitleFromUrl();
    this.getGameByTitle(this.title);
    this.getGameRateByTitle(this.title);
    this.getGameRateByTitleAndId(this.title);
    this.getPredictedRate(this.title);
  }

  private getGameByTitle(title: string) {
    this.gameService.getGameByTitle(title)
      .subscribe( game => this.game = game[0] );
  }

  private getGameRateByTitle(title: string) {
    this.gameRateService.getGameRateByTitle(title)
      .subscribe( gameRate => {
        this.gameRate = gameRate[0];
      });
  }

  public getPredictedRate(title:string) {
    let num = 20;

    Observable.forkJoin(
      this.userService.getCompareUsersByTargetUserId( this.currentUser.id, num ),
      this.gameRateService.getGameRateByTitle(title)
    ).map(res=>{
      let compareUsers = res[0];
      let target = res[1][0];
      return this.predictedRateService.computePredictedGameRate(target, this.currentUser, compareUsers);
    }).concatAll().subscribe(
      res => {
        res.rate = Math.round( res.rate * 10 ) / 10;
        this.predictedGameRate = res.rate;
      }
    );
  };//end of function

  public getGameRateByTitleAndId( title: string ) {
    this.gameRateService.getGameRateByTitleAndId( title, this.currentUser.id ).subscribe( res => {
      if ( res[0] === undefined ) return;
      this.currentUserGameRate = res[0].rate;
    });
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
