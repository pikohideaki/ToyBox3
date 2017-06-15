import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncGroupsComponent } from './sync-groups.component';

describe('SyncGroupsComponent', () => {
  let component: SyncGroupsComponent;
  let fixture: ComponentFixture<SyncGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
