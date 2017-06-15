import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomizerSelectCardsComponent } from './randomizer-select-cards.component';

describe('RandomizerSelectCardsComponent', () => {
  let component: RandomizerSelectCardsComponent;
  let fixture: ComponentFixture<RandomizerSelectCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomizerSelectCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomizerSelectCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
