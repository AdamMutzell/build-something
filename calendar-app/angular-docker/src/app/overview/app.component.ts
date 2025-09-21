import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CheckboxModule, 
    CommonModule, 
    FormsModule,
    ButtonModule, 
    DatePickerModule, 
    CardModule, 
    ChipModule, 
    InputTextModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'angular-docker';
  checked: boolean = false;
  dates: Date[] = [];
  events: PlannedEvent[] = [];

  addEvent(date: Date) {
    console.log(date);
    const newEvent = new PlannedEvent(date);
    this.events.push(newEvent);
  }
  onDatesChanged(newDates: Date[] | null) {
    console.log('Dates changed:', newDates);
    if (!newDates) {
      this.dates = [];
      this.events = [];
      return;
    }

    const diff: number = newDates.length - this.events.length;
    console.log('Difference in number of dates:', diff);
    if (diff > 0) {
      console.log('New dates added');
      const addedDates = newDates.filter(d => !this.events.some(existing => existing.date.getTime() === d.getTime()));
      addedDates.forEach(date => this.addEvent(date));
    } else if (diff < 0) {
      console.log('Dates removed');
      const removedDates = this.events.filter(d => !newDates.some(existing => existing.getTime() === d.date.getTime()));
      this.events = this.events.filter(e => !removedDates.some(rd => rd.date.getTime() === e.date.getTime()));
    }

    this.dates = newDates; // update reference
  }
}

class PlannedEvent {
  name: string;
  date: Date; 
  description: string;

  constructor(date: Date) {
    this.name = 'New Event';
    this.date = date;
    this.description = 'This is an event planned for ' + date.toDateString();
  }
}