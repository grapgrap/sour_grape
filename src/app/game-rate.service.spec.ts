/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GameRateService } from './game-rate.service';

describe('Service: GameRate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRateService]
    });
  });

  it('should ...', inject([GameRateService], (service: GameRateService) => {
    expect(service).toBeTruthy();
  }));
});
