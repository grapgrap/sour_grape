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
  private countGameRate = [];
  private count = [];

  private title: string;
  private errorMsg: string;

  constructor(
    private gameService: GameService,
    private gameRateService: GameRateService,
    private predictedRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.splitTitleFromUrl();
    this.getGameByTitle(this.title);
    this.getGameRateByTitle(this.title);
    this.getGameRateByTitleAndId(this.title);
    this.getPredictedRate(this.title);
    this.getRatePercent();
  }

  private getGameByTitle(title:string) {
    this.gameService.getGameByTitle( title )
      .subscribe( res=> {
        this.game = res[0];
      });
  }

  private getGameRateByTitle(title: string) {
    this.gameRateService.getGameRateByTitle(title)
      .subscribe( gameRate => {
        this.gameRate = gameRate[0];
      });
  }

  public getPredictedRate(title:string) {
    let num = 30;

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

  //취향 그래프용 함수
  private getRatePercent() {
    this.gameRateService.getCountAboutGameRateByTitle( this.title ).subscribe( res => {
      if( res == null ) return;
      let total = 0;
      for( let i = 0; i < res.length; i++ ){
        total = total + res[i].count;
      }
      for( let i = 0; i < res.length; i++ ){
        this.countGameRate[i] = res[i].count;
        this.count[i] = res[i].count;
        this.countGameRate[i] = Math.floor(this.countGameRate[i] / total * 100);
      }
    });
  }

  public max:number = 5;
  public rate:number = 0;

  public overStar:number;

  public ratingStates:any = [
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
  ];

  public hoveringOver(value:number):void {
    this.overStar = value;
  };

  public addRate():void {

    let now = new Date();
    let dateString = '' + now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    let gameRate:GameRate = new GameRate( this.currentUser.id, this.game.title, this.overStar, dateString);
    this.gameRateService.addGameRate( gameRate )
      .subscribe(res =>{
        console.log( res );
        this.predictedGameRate = 0;
        this.currentUserGameRate = this.overStar
      });
  }

  public resetStar():void {
    this.overStar = void 0;
  }
}
