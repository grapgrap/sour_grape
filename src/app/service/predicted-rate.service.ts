import {GameRate} from "../model/game-rate";
import {Game} from "../model/game";
import {User} from "../model/user";
import {GameRateService} from "./game-rate.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {isUndefined} from "util";

@Injectable()
export class PredictedRateService {

  constructor(private gameRateService: GameRateService){}

  private computeMedium( gameRates: GameRate[] ):number {
    let result = 0;
    for( let i = 0; i < gameRates.length; i++ ) {
      result = result + gameRates[i].rate;
    }
    result = result / gameRates.length;
    return result;
  }

  //예상 평점 계산 함수
  public computePredictedGameRate( targetGame: GameRate, gameRatesByTargetUser: GameRate[], compareUsers: User[] ):Observable<GameRate> {
    let observableCompareUsers = Observable.from( compareUsers );
    return Observable.forkJoin(
      observableCompareUsers.map(compareUser => this.gameRateService.getGameRatesById( compareUser.id )).concatAll().toArray(),
      observableCompareUsers.map(compareUser => this.gameRateService.getSimilarByTargetAndCompare( gameRatesByTargetUser[0].gr_id, compareUser.id )).concatAll().toArray()
    ).map(
      res => {
        const gameRatesByCompareUsers = res[0]; //compareUser들의 게임 평가 정보들
        const similarByTargetUserAndCompareUsers = res[1]; //유사도

        let targetUserMedium = this.computeMedium( gameRatesByTargetUser );
        let compareUsersMedium = [];
        let a = 0;
        let b = 0;

        console.log( gameRatesByCompareUsers );

        for( let i = 0; i < gameRatesByCompareUsers.length; i++ ){
          compareUsersMedium[i] = this.computeMedium( gameRatesByCompareUsers[i] ); // Rl의 평균
          console.log( gameRatesByCompareUsers[i][0] );
          for ( let j = 0; j < gameRatesByCompareUsers[i].length; j++ ) { // Rli를 찾는 루프
            if( gameRatesByCompareUsers[i][j].gr_title != targetGame.gr_title ) { //Rli 가 없으면 뛰어 넘음.
              continue;
            } else {
              b = b + Math.abs( similarByTargetUserAndCompareUsers[i] );
              a = a + ( (gameRatesByCompareUsers[i][j].rate - compareUsersMedium[i]) * similarByTargetUserAndCompareUsers[i] );
            }
          } // end of j for loop
        } // end of i for loop

        console.log( a );
        console.log( b );
        console.log( targetUserMedium );

        targetGame.rate = targetUserMedium + ( a / b );
        if( b == 0 ) targetGame.rate = 0;
        if( targetGame.rate > 5 ) targetGame.rate = 5;
        return targetGame;
      }
    );
  }
}
