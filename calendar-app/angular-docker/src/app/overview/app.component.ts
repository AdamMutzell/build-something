import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { PlannedEvent } from '../event';
import { API_LINK_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-root',
  imports: [
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
  styleUrls: ['../../styles.scss', './app.component.scss']
})


export class AppComponent {
  title = 'angular-docker';
  checked: boolean = false;
  dates: Date[] = [];
  events: PlannedEvent[] = [];
  eventLink: string = '';

  copyLink() {
    navigator.clipboard.writeText(this.eventLink).then(() => {
      console.log('Link copied to clipboard:', this.eventLink);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }

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

  testApi() {
    fetch(`${API_LINK_BASE_URL}/`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);
    })
    .catch(error => {
      console.error('Error calling API:', error);
    });
  }

  testSquare() {
    const numberToSquare = this.events.length ;
    fetch(`${API_LINK_BASE_URL}/square/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ num: numberToSquare })
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);
    })
    .catch(error => {
      console.error('Error calling API:', error);
    });
  }

  sendToDatabase() {
    const message = this.events.map(event => event.toJSON());

    fetch(`${API_LINK_BASE_URL}/database/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);
      this.eventLink = data.link;
    })
    .catch(error => {
      console.error('Error calling API:', error);
    });
  }
}