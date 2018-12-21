import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-msg',
  templateUrl: './validation-msg.component.html',
  styleUrls: ['./validation-msg.component.scss']
})
export class ValidationMsgComponent implements OnInit {
  @Input() messages;
  @Input() control: FormControl;

  constructor() { }

  ngOnInit() {
  }

  checkControl(control) {
    return control.touched;
  }

  shouldDisplay() {
    if (!this.control.invalid) return false;

    if (this.control.hasOwnProperty("controls")) {
      return Object.values(this.control["controls"]).every(control => this.checkControl(control));
    } else {
      return this.checkControl(this.control);
    }
  }
}
