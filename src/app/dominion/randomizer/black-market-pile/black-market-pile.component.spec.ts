import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackMarketPileComponent } from './black-market-pile.component';

describe('BlackMarketPileComponent', () => {
  let component: BlackMarketPileComponent;
  let fixture: ComponentFixture<BlackMarketPileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackMarketPileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackMarketPileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
