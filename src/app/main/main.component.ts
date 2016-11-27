import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import {GameRateService} from "../service/game-rate.service";
import {GameService} from "../service/game.service";
import {PredictedRateService} from "../service/predicted-rate.service";
import {UserService} from "../service/user.service";

import {User} from "../model/user";
import { GameRate } from '../model/game-rate';
import {Observable} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [
    GameRateService,
    GameService,
  ]
})
export class MainComponent implements OnInit {
  private gameRates: GameRate[] = [];
  private currentUser: User;
  private errorMsg: string = '';

  private count = 0;

  constructor(
    private gameRateService: GameRateService,
    private router: Router
  ) {
    let tempUser = new User('0235', '1234', 'AAA');
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
    this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
  }

  ngOnInit() {
    this.getGameRates();
  }

  private getGameRates() {
    this.gameRateService.getGameRates().subscribe(
      res => { this.gameRates = res; },
      error => this.errorMsg = error
    );
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
  public moveToRankMorePage() {
    this.router.navigate(['/game-rank-more']);
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
