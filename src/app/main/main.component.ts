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
  private game: Game;

  private currentUser: User;
  private errorMsg: string = '';

  private result: number;
  private isTasteGameRanking = false;
  private isWholeGameRanking = true;

  constructor(
    private gameRateService: GameRateService,
    private gameService: GameService,
    private predictedGameRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ) {
    let tempUser = new User('AAA', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
  }

  ngOnInit() {
    this.getGameRates();
    this.getPredictedRate();
  }

  private getGameRates() {
    this.gameRateService.getGameRates().subscribe(
      gameRates => this.gameRates = gameRates,
      error => this.errorMsg = error
    );
    console.log( this.errorMsg );
  }

  public getPredictedRate() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let num = 5;

    Observable.forkJoin(
      this.gameRateService.getGameRates()
        .flatMap( gameRate => this.gameService.getGameByTitle(gameRate[0].gr_title) ),
      this.userService.getCompareUsersByTargetUserId( this.currentUser.id, num )
    ).subscribe(
      res => {
        this.game = res[0][0];
        this.users = res[1];
        this.result = this.predictedGameRateService.computePredictedGameRate( this.game, this.currentUser, this.users );
      }
    );
  }


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
