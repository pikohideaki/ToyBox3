import { TestBed, inject } from '@angular/core/testing';

import { MyFirebaseSubscribeService } from './my-firebase-subscribe.service';

describe('MyFirebaseSubscribeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyFirebaseSubscribeService]
    });
  });

  it('should be created', inject([MyFirebaseSubscribeService], (service: MyFirebaseSubscribeService) => {
    expect(service).toBeTruthy();
  }));
});
