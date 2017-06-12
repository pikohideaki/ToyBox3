import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResultListComponent } from './game-result-list.component';

describe('GameResultListComponent', () => {
  let component: GameResultListComponent;
  let fixture: ComponentFixture<GameResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
