import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertDatabaseComponent } from './convert-database.component';

describe('ConvertDatabaseComponent', () => {
  let component: ConvertDatabaseComponent;
  let fixture: ComponentFixture<ConvertDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
