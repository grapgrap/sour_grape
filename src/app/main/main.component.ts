import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import {GameRateService} from "../service/game-rate.service";
import {GameService} from "../service/game.service";
import {PredictedRateService} from "../service/predicted-rate.service";
import {UserService} from "../service/user.service";

import {User} from "../model/user";
import {Game} from "../model/game";
import { GameRate } from '../model/game-rate';
import {Observable} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [
    GameRateService,
    GameService,
    PredictedRateService,
    UserService
  ]
})
export class MainComponent implements OnInit {
  private gameRates: GameRate[];
  private users: User[];
  private games: Game[];
  private prediectedGameRates: GameRate[];
  private currentUser: User;
  private errorMsg: string = '';

  private results: Array<number> = new Array();
  private isTasteGameRanking = false;
  private isWholeGameRanking = true;

  constructor(
    private gameRateService: GameRateService,
    private gameService: GameService,
    private predictedGameRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ) {
    let tempUser = new User('0235', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }

  ngOnInit() {
    this.getGameRates();
  }

  private getGameRates() {
    if ( this.gameRates != null ) this.gameRateService.getGameRates();

    this.gameRateService.getGameRates().subscribe(
      gameRates => this.gameRates = gameRates,
      error => this.errorMsg = error
    );
  }

  public getPredictedRate(gameRates: GameRate[]) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let num = 5;
    let observableGameRates = Observable.from(gameRates);
    Observable.forkJoin(
      this.gameRateService.getGameRatesById( this.currentUser.id ).flatMap(
        gameRateByCurrentUser => {
         return observableGameRates.filter(wholeGameRate =>{
           for( let i = 0; i < gameRateByCurrentUser.length; i++ ) {
             if(wholeGameRate.gr_title === gameRateByCurrentUser[i].gr_title) return false;
           }return true;
         });
        }).toArray(),
      this.userService.getCompareUsersByTargetUserId( this.currentUser.id, num )
    ).map( res =>{
      this.prediectedGameRates = res[0];
      let compareUsers = res[1];
      let o = [];
      for ( let i = 0; i < this.prediectedGameRates.length; i++ ){
        o.push( this.predictedGameRateService.computePredictedGameRate( this.prediectedGameRates[i], this.currentUser, compareUsers ));
      }
      this.prediectedGameRates = [];
      return Observable.from(o);
    }).concatAll().subscribe( res => {
      res.subscribe( resp => {
        this.prediectedGameRates.push( resp );
        this.prediectedGameRates.map( x => { console.log(x); x.rate = Math.round( x.rate * 10 ) / 10; } );
        this.prediectedGameRates = this.prediectedGameRates.sort( (a,b) => {
          return a.rate > b.rate ? -1 : ( a.rate < b.rate ? 1 : 0 );
        });//end of sort
      });//end of second subscribe
    });//end of first subscribe
  };//end of function


  //랭킹 스위치 함수
  public changeToWholeRanking() {
    this.isTasteGameRanking = false;
    this.isWholeGameRanking = true;
  }
  public changeToTasteRanking() {
    this.isTasteGameRanking = true;
    this.isWholeGameRanking = false;
  }

  //라우터 함수
  public moveToGameDetailPage(title: string) {
    this.router.navigate(['/game', title]);
  }
  public moveToResultPage(keyword: string) {
    if( keyword.length < 4 ) {
      alert('최소 4글자 이상을 입력해 주세요');
      return;
    } else {
      this.router.navigate(['/search', keyword]);
    }
  }

  //취향 그래프용 함수
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
