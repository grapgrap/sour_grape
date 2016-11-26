import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";

import {GameRate} from "../model/game-rate";
import {User} from "../model/user";

import {GameRateService} from "../service/game-rate.service";
import {PredictedRateService} from "../service/predicted-rate.service";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";

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

  private isTaste:boolean = false;
  private isWhole:boolean = false;

  private type: string;
  private pageTitle: string;

  constructor(
    private gameRateService: GameRateService,
    private predictedGameRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ) {
    let tempUser = new User('AAA', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }

  ngOnInit() {
    this.getGameRates();
    this.splitTitleFromUrl();
    this.setType();
  }

  private setType() {
    if( this.type == "taste-game") {
      this.isTaste = true;
      this.pageTitle = "취향 게임 랭킹"
    }
    else {
      this.isWhole = true;
      this.pageTitle = "전체 게임 랭킹"
    }
  }

  private getGameRates() {
    this.gameRateService.getGameRates().subscribe(
      res => {
        console.log( res );
        this.gameRates = res;
        this.getPredictedRate(res);
      },
      error => this.errorMsg = error
    );
  }

  public getPredictedRate(gameRates: GameRate[]) {
    if ( this.prediectedGameRates.length != 0 ) return;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let show = 10;
    let num = 5;
    let limit = 0;
    let temp = gameRates;
    let observableGameRates = Observable.from(temp);
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

      if( show > target.length ) show = target.length;
      for ( let i = 0; i < show; i++ ){
        o.push( this.predictedGameRateService.computePredictedGameRate( target[i], this.currentUser, compareUsers ));
      }
      return Observable.from(o);
    }).concatAll().subscribe( res => {
      res.subscribe( resp => {
        this.prediectedGameRates.push( resp );
        this.prediectedGameRates.map( x => { x.rate = Math.round( x.rate * 10 ) / 10; } );
        this.prediectedGameRates = this.prediectedGameRates.sort( (a,b) => {
          return a.rate > b.rate ? -1 : ( a.rate < b.rate ? 1 : 0 );
        });//end of sort
      });//end of second subscribe
    });//end of first subscribe
  };//end of function

  private splitTitleFromUrl(){
    let currentPath = this.router.url;
    let temp: string[] = currentPath.split('/game-rank-more/');
    this.type = temp[1];
  }
  public moveToResultPage(keyword: string) {
    if( keyword.length < 4 ) {
      alert('최소 4글자 이상을 입력해 주세요');
      return;
    } else {
      this.router.navigate(['/search', keyword]);
    }
  }
}
