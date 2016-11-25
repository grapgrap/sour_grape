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
  public computePredictedGameRate( targetGame: Game, targetUser: User, compareUsers: User[] ):Observable<number> {
    let observableCompareUsers = Observable.from( compareUsers );

    return Observable.forkJoin(
      this.gameRateService.getGameRatesById( targetUser.id ),
      observableCompareUsers.map(compareUser => this.gameRateService.getGameRatesById( compareUser.id )).concatAll().toArray(),
      observableCompareUsers.map(compareUser => this.gameRateService.getGameRateByTitleAndId( targetGame.title, compareUser.id )).concatAll().toArray()
      //observableCompareUsers.map(compareUser => this.gameRateService.getSimilarByTargetAndCompare( targetUser.id, compareUser.id )).concatAll().toArray()
    ).map(
      res => {
        const gameRatesByTargetUser = res[0];
        const gameRatesByCompareUsers = res[1];
        const gameRatesByTargetGameAndCompareUsers = res[2];
        //const similarByTargetUserAndCompareUsers = res[3];
        const similarDummy = 1;


        let targetUserMedium = this.computeMedium( gameRatesByTargetUser );
        let compareUsersMedium = [];
        let a = 0;
        let b = 0;
        for( let i = 0; i < gameRatesByCompareUsers.length; i++ ){
          compareUsersMedium[i] = this.computeMedium( gameRatesByCompareUsers[i] );
          if( gameRatesByTargetGameAndCompareUsers[i][0] === undefined) continue;
          a = a + ( (gameRatesByTargetGameAndCompareUsers[i][0].rate - compareUsersMedium[i]) * similarDummy );
          b = b + Math.abs( similarDummy );
        }
        return targetUserMedium + ( a / b );
      }
    );
  }
}
