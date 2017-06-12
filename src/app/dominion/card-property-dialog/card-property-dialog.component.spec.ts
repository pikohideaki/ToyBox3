import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPropertyDialogComponent } from './card-property-dialog.component';

describe('CardPropertyDialogComponent', () => {
  let component: CardPropertyDialogComponent;
  let fixture: ComponentFixture<CardPropertyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPropertyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
