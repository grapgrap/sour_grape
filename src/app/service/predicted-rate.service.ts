import {GameRate} from "../model/game-rate";
import {Game} from "../model/game";
import {User} from "../model/user";
import {GameRateService} from "./game-rate.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class PredictedRateService {

  constructor(private gameRateService: GameRateService){}

  //예상 평점 계산 함수
  public computePredictedGameRate( targetGame: Game, targetUser: User, compareUsers: User[]):number {
    var targetUserGameRates: GameRate[];
    var compareUsersGameRates: GameRate[];
    var a = 0;
    var b = 0;

    var observableCompareUsers = Observable.from(compareUsers);
    var result = -123;


    let val = observableCompareUsers.flatMap( compareUser => this.gameRateService.getGameRatesById( compareUser.id ) ).concatAll()
      .subscribe(
        res => {
          compareUsersGameRates = res;
          console.log( "1" );
        },
      );

    Observable.forkJoin(
      this.gameRateService.getGameRatesById( targetUser.id ),
      observableCompareUsers.flatMap( compareUser => this.gameRateService.getGameRateByTitleAndId( targetGame.title, compareUser.id ) )
    ).subscribe(
      res => {
        console.log( res );
        //console.log( res[0] );
        //console.log(res);
        //console.log( res[2] );
      }
    );
    console.log( "2" );
    return result;
  }
}
