import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameResultComponent } from './add-game-result.component';

describe('AddGameResultComponent', () => {
  let component: AddGameResultComponent;
  let fixture: ComponentFixture<AddGameResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGameResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
