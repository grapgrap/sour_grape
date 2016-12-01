import { Component, OnInit } from '@angular/core';
import {GameRateService} from "../service/game-rate.service";
import {GameRate} from "../model/game-rate";
import {PredictedRateService} from "../service/predicted-rate.service";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recommand-game',
  templateUrl: './recommand-game.component.html',
  styleUrls: ['./recommand-game.component.css'],
  providers: [
    GameRateService,
    PredictedRateService,
    UserService
  ]
})
export class RecommandGameComponent implements OnInit {
  private gameRates: GameRate[] = [];
  private showGameRates: GameRate[] = [];
  private results: GameRate[] = [];
  private currentUser: User;
  private page: number = 1;

  constructor(
    private gameRateService: GameRateService,
    private predictedRateService: PredictedRateService,
    private userService: UserService,
    private router: Router
  ){ }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.getGameRates();
  }

  //
  public getGameRates() {
    this.gameRateService.getGameRates().subscribe(
      res => {
        this.gameRates = res;
        this.getPredictedGameRate();
      });
  }

  public getPredictedGameRate() {
    //현재 유저가 평가한 모든 데이터를 들고 와서
    this.gameRateService.getGameRatesById( this.currentUser.id ).subscribe(res=>{

      // 현재 유저가 평가한 데이터는 제외한다.
      for( let i = 0; i < res.length; i++ ){
        for( let j = 0; j < this.gameRates.length; j++ ){
          if ( res[i].gr_title == this.gameRates[j].gr_title ){
            this.gameRates.splice(j, 1);
            break;
          }
        }
      }
      //필터링 된 데이터를 가지고 예산 점수를 계산.
      this.computePredictedGameRate();
    });
  }

  // 예상 점수 계산 함수
  public computePredictedGameRate() {
    let num = 30;

    // 필터링 된 데이터의 길이만큼 루프가 돈다.
    for ( let i = 0; i < this.gameRates.length; i++ ) {
      let title = this.gameRates[i].gr_title;

      // 현재 유저의 비교 유저를 num 만큼 들고오고, 인덱스에 해당하는 게임에 대한 게임 레이트 정보를 들고온다.
      Observable.forkJoin(
        this.userService.getCompareUsersByTargetUserId( this.currentUser.id, num ),
        this.gameRateService.getGameRateByTitle(title)
      ).map(res=>{
        let compareUsers = res[0];
        let target = res[1][0];

        // 인덱스에 해당하는 게임 레이트 정보와 현제 유저, 비교 유저 한명을 데리고 예상 점수를 판단한다.
        return this.predictedRateService.computePredictedGameRate(target, this.currentUser, compareUsers);
      }).concatAll().subscribe(res => {
          //판단된 예상 점수는 x.x 형태로 만들어져서 showGameRate의 인덱스 번째에 삽입된다.
          res.rate = Math.round( res.rate * 10 ) / 10;
          this.showGameRates[i] = res;
      });
    }
  }

  public loadMore() {
    let count = 1;
    this.results = this.showGameRates.slice(0, count * this.page);
    this.page ++;
  }

  public moveToGameDetailPage(title: string) {
    this.router.navigate(['/game', title]);
  }
}
