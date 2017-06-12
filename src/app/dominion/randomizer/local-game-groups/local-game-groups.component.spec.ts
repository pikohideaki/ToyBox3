import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGameGroupsComponent } from './local-game-groups.component';

describe('LocalGameGroupsComponent', () => {
  let component: LocalGameGroupsComponent;
  let fixture: ComponentFixture<LocalGameGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalGameGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalGameGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
