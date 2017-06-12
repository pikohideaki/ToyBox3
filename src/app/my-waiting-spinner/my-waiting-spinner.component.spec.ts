import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWaitingSpinnerComponent } from './my-waiting-spinner.component';

describe('MyWaitingSpinnerComponent', () => {
  let component: MyWaitingSpinnerComponent;
  let fixture: ComponentFixture<MyWaitingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWaitingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWaitingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
