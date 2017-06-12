import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitGameResultDialogComponent } from './submit-game-result-dialog.component';

describe('SubmitGameResultDialogComponent', () => {
  let component: SubmitGameResultDialogComponent;
  let fixture: ComponentFixture<SubmitGameResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitGameResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitGameResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
