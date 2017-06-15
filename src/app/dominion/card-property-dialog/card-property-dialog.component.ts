import { Component, OnInit } from '@angular/core';

import { MdDialogRef } from '@angular/material';


@Component({
  selector: 'card-property-dialog',
  templateUrl: './card-property-dialog.component.html',
  styleUrls: ['./card-property-dialog.component.css']
})
export class CardPropertyDialogComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<CardPropertyDialogComponent>,
  ) {}

  ngOnInit() {
    this.width = this.setImageWidth();
  }

  card: any;
  faceUp = true;
  // fileSize = '';
  width: number;


  setImageWidth() {
    /* innerHeight, innerWidth : app window size
       outerHeight, outerWidth : browser window size */

    const padding = 24;

    const modalWidth = 0.8 * innerWidth;
    const correction1 = 30;  // 補正
    const w1 = 0.4 * (modalWidth - padding * 2) - correction1;

    const modalHeight = 0.8 * innerHeight;
    const correction2 = 150;  // 補正
    const w2 = 75 / 115 * ((modalHeight - padding * 2) - correction2);
    
    return Math.min( w1, w2 ); 
  }


}

