import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResutOfPlayerComponent } from './game-resut-of-player.component';

describe('GameResutOfPlayerComponent', () => {
  let component: GameResutOfPlayerComponent;
  let fixture: ComponentFixture<GameResutOfPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResutOfPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResutOfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
