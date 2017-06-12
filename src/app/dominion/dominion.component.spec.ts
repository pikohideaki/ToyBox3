import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DominionComponent } from './dominion.component';

describe('DominionComponent', () => {
  let component: DominionComponent;
  let fixture: ComponentFixture<DominionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DominionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DominionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
