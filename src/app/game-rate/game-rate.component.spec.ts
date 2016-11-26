/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameRateComponent } from './game-rate.component';

describe('GameRateComponent', () => {
  let component: GameRateComponent;
  let fixture: ComponentFixture<GameRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
