import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";

import {GameRate} from "../model/game-rate";
import {User} from "../model/user";

import {GameRateService} from "../service/game-rate.service";
import {PredictedRateService} from "../service/predicted-rate.service";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-game-rank-more',
  templateUrl: './game-rank-more.component.html',
  styleUrls: ['./game-rank-more.component.css'],
  providers: [
    GameRateService,
    PredictedRateService,
    UserService
  ]
})
export class GameRankMoreComponent implements OnInit {
  private gameRates: GameRate[];
  private prediectedGameRates: GameRate[] = [];
  private currentUser: User;
  private errorMsg: string = '';

  private count = 0;
  private page = 0;

  private isTasteGameRanking = false;
  private isWholeGameRanking = true;

  constructor(
    private gameRateService: GameRateService,
    private predictedGameRateService: PredictedRateService,
    private userService: UserService,
  ) {
    let tempUser = new User('AAA', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }

  ngOnInit() {
    this.getGameRates();
  }

  private getGameRates() {
    if ( this.gameRates != null ) {
      this.gameRateService.getGameRates();
      return;
    }

    this.gameRateService.getGameRates().subscribe(
      gameRates => this.gameRates = gameRates,
      error => this.errorMsg = error
    );
  }
  public getPredictedRate(gameRates: GameRate[]) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let show = 10;
    let num = 5;
    let limit = 0;
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
      let target = res[0];
      let compareUsers = res[1];
      let o = [];

      // 0페이지 일때는 0부터 20개, 1페이지 일때는 20부터 20개
      if( show * (this.page + 1) > target.length ) {
        limit = target.length;
      } else {
        limit = show * (this.page + 1);
      }
      for ( let i = show * this.page; i < limit; i++ ){
        o.push( this.predictedGameRateService.computePredictedGameRate( target[i], this.currentUser, compareUsers ));
      }
      return Observable.from(o);
    }).concatAll().subscribe( res => {
      console.log( res );
      this.count = this.count + 1;
      console.log( this.count );
      res.subscribe( resp => {
        console.log( resp );
        this.prediectedGameRates.push( resp );
        this.prediectedGameRates.map( x => { console.log(x); x.rate = Math.round( x.rate * 10 ) / 10; } );
        this.prediectedGameRates = this.prediectedGameRates.sort( (a,b) => {
          return a.rate > b.rate ? -1 : ( a.rate < b.rate ? 1 : 0 );
        });//end of sort
      });//end of second subscribe
    });//end of first subscribe
    this.page = this.page + 1;
  }//end of function

  //랭킹 스위치 함수
  public changeToWholeRanking() {
    this.isTasteGameRanking = false;
    this.isWholeGameRanking = true;
  }
  public changeToTasteRanking() {
    this.isTasteGameRanking = true;
    this.isWholeGameRanking = false;
  }
}
