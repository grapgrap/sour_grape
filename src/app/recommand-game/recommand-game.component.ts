import { Component, OnInit } from '@angular/core';
import {GameRateService} from "../service/game-rate.service";
import {GameRate} from "../model/game-rate";
import {PredictedRateService} from "../service/predicted-rate.service";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {UserService} from "../service/user.service";

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
  private currentUser: User;
  private page: number = 1;

  constructor(
    private gameRateService: GameRateService,
    private predictedRateService: PredictedRateService,
    private userService: UserService
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
    this.gameRateService.getGameRatesById( this.currentUser.id ).subscribe(res=>{
      console.log( this.gameRates );
      for( let i = 0; i < res.length; i++ ){
        for( let j = 0; j < this.gameRates.length; j++ ){
          if ( res[i].gr_title == this.gameRates[j].gr_title ){
            console.log( this.gameRates[j] );
            this.gameRates.splice(j, 1);
            break;
          }
        }
      }
      console.log( this.gameRates );

      this.computePredictedGameRate();
    });
  }

  public computePredictedGameRate() {
    let num = 50;
    for ( let i = 0; i < this.gameRates.length; i++ ) {
      let title = this.gameRates[i].gr_title;
      console.log( title );
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
          this.showGameRates[i] = res;
        });
    }
  }

  public loadMore() {
    let count = 10;
    this.page ++;
  }
}
