import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResultOfPlayerComponent } from './game-result-of-player.component';

describe('GameResultOfPlayerComponent', () => {
  let component: GameResultOfPlayerComponent;
  let fixture: ComponentFixture<GameResultOfPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResultOfPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultOfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
