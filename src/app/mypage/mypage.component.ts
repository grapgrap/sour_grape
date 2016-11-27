import { Component, OnInit } from '@angular/core';
import {GameRateService} from "../service/game-rate.service";
import {GameRate} from "../model/game-rate";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.css'],
  providers: [
    GameRateService
  ]
})
export class MypageComponent implements OnInit {
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private randomMsg: string[];
  private msg: string;
  private gameRates: GameRate[];
  private currentGameRateCount: number;
  private maxCount: number;
  private tasteType: string;
  private countType: string;
  private gameRateMedium: number;
  private countGameRate = [];

  constructor(
    private gameRateService: GameRateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getGameRateByCurrentUserId();
    this.tasteType = "";
    this.countType = "";
    this.getRatePercent();
  }
  public test() {
    this.currentGameRateCount = this.currentGameRateCount + 1;
    this.currentGameRateCount = this.currentGameRateCount - (Math.floor( this.currentGameRateCount / 100 ) * 100);
    this.maxCount = (Math.floor( this.currentGameRateCount / 100 ) + 1) * 100;
  }

  public setTasteType() {
    let limit = 10;
    if ( this.currentGameRateCount < limit ) this.tasteType = "" + (limit - this.currentGameRateCount) + "개만 더 평가 하시면 당신의 성향을 알려줄 수 있어요";
    else {
      if ( 0 < this.gameRateMedium && this.gameRateMedium <= 2 ) this.tasteType = "당신이 재밌어할 게임을 만들기는 너무 어려워요";
      else if ( 2 < this.gameRateMedium && this.gameRateMedium <= 3 ) this.tasteType = "당신은 게임 평론가 만큼 깐깐해요";
      else if ( 3 < this.gameRateMedium && this.gameRateMedium <= 4 ) this.tasteType = "당신이 재밌어하는 게임은 올해의 게임상을 받겠군요";
      else if ( 4 < this.gameRateMedium && this.gameRateMedium <= 5 ) this.tasteType = "당신같은 사람만 있다면 게임 개발자들은 환호성을 지를겁니다.";
    }
  }
  public setCountType() {
    if( this.currentGameRateCount < 10 ) this.countType = "게임 세계에 발을 들여놓은 걸 환영합니다.";
    else if( this.currentGameRateCount < 20 ) this.countType = "유명한 게임은 한번씩 다 해보셨을 껄요?";
    else this.countType = "굉장합니다! 당신이 해보지 않은 게임이 있을까요?";
  }

  private getRatePercent() {
    this.gameRateService.getCountAboutGameRateById( this.currentUser.id ).subscribe( res => {
      console.log( res );
      if( res == null ) return;
      let total = 0;
      for( let i = 0; i < res.length; i++ ){
        total = total + res[i].count;
      }
      for( let i = 0; i < res.length; i++ ){
        this.countGameRate[i] = res[i].count;
        this.countGameRate[i] = Math.floor(this.countGameRate[i] / total * 100);
      }
    });
  }

  public getGameRateByCurrentUserId() {
    this.gameRateService.getGameRatesById( this.currentUser.id ).subscribe(
      res => {
        this.gameRates = res;
        this.currentGameRateCount = this.gameRates.length - (Math.floor( this.gameRates.length / 100 ) * 100);
        this.maxCount = (Math.floor( this.gameRates.length / 100 ) + 1) * 100;
        this.gameRateMedium = this.computeMedium( this.gameRates )
        this.setTasteType();
        this.setCountType();
      }
    );
  }
  public moveToGameRatePage() {
    this.router.navigate(['/game-rate']);
  }
  public moveToGameDetailPage(title: string) {
    this.router.navigate(['/game', title]);
  }

  private computeMedium( gameRates: GameRate[] ):number {
    let result = 0;
    for( let i = 0; i < gameRates.length; i++ ) {
      result = result + gameRates[i].rate;
    }
    result = result / gameRates.length;
    result = Math.floor( result * 100 ) / 100;
    return result;
  }
}
