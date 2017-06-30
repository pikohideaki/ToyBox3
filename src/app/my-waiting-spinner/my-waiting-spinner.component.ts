import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'my-waiting-spinner',
  templateUrl: './my-waiting-spinner.component.html',
  styleUrls: ['./my-waiting-spinner.component.css']
})
export class MyWaitingSpinnerComponent implements OnInit {

  @Input() done: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
