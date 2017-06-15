import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPropertyListComponent } from './card-property-list.component';

describe('CardListComponent', () => {
  let component: CardPropertyListComponent;
  let fixture: ComponentFixture<CardPropertyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPropertyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
