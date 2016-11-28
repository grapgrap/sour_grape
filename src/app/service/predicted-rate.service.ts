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
  public computePredictedGameRate( targetGame: GameRate, targetUser: User, compareUsers: User[] ):Observable<GameRate> {
    let observableCompareUsers = Observable.from( compareUsers );
    return Observable.forkJoin(
      this.gameRateService.getGameRatesById( targetUser.id ),
      observableCompareUsers.map(compareUser => this.gameRateService.getGameRatesById( compareUser.id )).concatAll().toArray(),
      observableCompareUsers.map(compareUser => this.gameRateService.getGameRateByTitleAndId( targetGame.gr_title, compareUser.id )).concatAll().toArray(),
      observableCompareUsers.map(compareUser => this.gameRateService.getSimilarByTargetAndCompare( targetUser.id, compareUser.id )).concatAll().toArray()
    ).map(
      res => {
        const gameRatesByTargetUser = res[0]; //target 유저의 게임 평가 정보들
        const gameRatesByCompareUsers = res[1]; //compareUser들의 게임 평가 정보들
        const gameRatesByTargetGameAndCompareUsers = res[2]; //compare유저들의 타겟 게임에 대한 게임 평가 정보
        const similarByTargetUserAndCompareUsers = res[3];

        let targetUserMedium = this.computeMedium( gameRatesByTargetUser );
        let compareUsersMedium = [];
        let a = 0;
        let b = 0;

        for( let i = 0; i < gameRatesByCompareUsers.length; i++ ){
          console.log( gameRatesByTargetGameAndCompareUsers[i][0] );
          compareUsersMedium[i] = this.computeMedium( gameRatesByCompareUsers[i] );
          if( gameRatesByTargetGameAndCompareUsers[i].length == 0) continue;
          b = b + Math.abs( similarByTargetUserAndCompareUsers[i] );
          a = a + ( (gameRatesByTargetGameAndCompareUsers[i][0].rate - compareUsersMedium[i]) * similarByTargetUserAndCompareUsers[i] );
        }

        targetGame.rate = targetUserMedium + ( a / b );
        if( b == 0 ) targetGame.rate = 0;
        return targetGame;
      }
    );
  }
}
