import { TestBed, inject } from '@angular/core/testing';

import { MyUtilitiesService } from './my-utilities.service';

describe('MyUtilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyUtilitiesService]
    });
  });

  it('should be created', inject([MyUtilitiesService], (service: MyUtilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
