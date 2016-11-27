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
  private currentUser: User;
  private errorMsg: string = '';


  private type: string;

  constructor(
    private gameRateService: GameRateService,
    private router: Router
  ) {
    this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
  }

  ngOnInit() {
    this.getGameRates();
    this.splitTitleFromUrl();
  }

  private getGameRates() {
    this.gameRateService.getGameRates().subscribe(
      res => {
        this.gameRates = res;
      },
      error => this.errorMsg = error
    );
  }

  private splitTitleFromUrl(){
    let currentPath = this.router.url;
    let temp: string[] = currentPath.split('/game-rank-more/');
    this.type = temp[1];
  }

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
}
