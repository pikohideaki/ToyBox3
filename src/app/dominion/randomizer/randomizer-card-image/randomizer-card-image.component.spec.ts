import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomizerCardImageComponent } from './randomizer-card-image.component';

describe('RandomizerCardImageComponent', () => {
  let component: RandomizerCardImageComponent;
  let fixture: ComponentFixture<RandomizerCardImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomizerCardImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomizerCardImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
