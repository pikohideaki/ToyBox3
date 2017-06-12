import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleBooksComponent } from './rule-books.component';

describe('RuleBooksComponent', () => {
  let component: RuleBooksComponent;
  let fixture: ComponentFixture<RuleBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
