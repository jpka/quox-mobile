import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit {
  @ViewChild("form") formElement;

  constructor() { }

  ngOnInit() {
  }
}
