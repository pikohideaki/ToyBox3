import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPerPageComponent } from './items-per-page.component';

describe('ItemsPerPageComponent', () => {
  let component: ItemsPerPageComponent;
  let fixture: ComponentFixture<ItemsPerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsPerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsPerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
