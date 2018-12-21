import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() value: number = 0;
  @Input() orientation: string = "right";

  constructor() { }

  ngOnInit() {
  }
}
