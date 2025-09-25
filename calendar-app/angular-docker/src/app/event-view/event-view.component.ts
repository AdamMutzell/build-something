import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { PlannedEvent } from '../event';

import { API_SIGNUP_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-event-view',
  imports: [
    CheckboxModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    CardModule,
    ChipModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './event-view.component.html',
  styleUrls: ['../../styles.scss', './event-view.component.scss']
})
export class EventViewComponent {
  title = 'event-view';
  eventGroupId!: number;
  events: PlannedEvent[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.eventGroupId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Event Group ID:', this.eventGroupId);
    this.getEventData();

  }

  getEventData() {
    const message = { creationId: this.eventGroupId };
    console.log('Sending message to API:', message);

    fetch(`${API_SIGNUP_BASE_URL}/fetch_events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .then(response => {
      const events = response.json();
      return events;
    })
    .then(data => {
      console.log('Received data from API:', data);
      const parsedData = JSON.parse(data.data.replace(/'/g, '"'));
      this.events = parsedData.map((event: any) => 
        new PlannedEvent(
          new Date(event.start), 
          event.id,
          event.title, 
          event.description, 
          event.selected, 
          event.numberOfAttendees
        ));
    })
    .catch(error => {
      console.error('Error calling API:', error);
    });
  }
  submitAttendance() {
    const selectedEvents = this.events.filter(event => event.selected);
    if (selectedEvents.length === 0) {
      console.log('No events selected for attendance.');
      return;
    }

    const message = {
      creationId: this.eventGroupId,
      events: selectedEvents.map(event => ({
        id: event.id,
        name: event.name,
        date: event.date,
        description: event.description,
        selected: event.selected,
        numberOfAttendees: event.numberOfAttendees
      }))
    };

    console.log('Submitting attendance to API:', message);

    fetch(`${API_SIGNUP_BASE_URL}/submit_attendance/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Attendance submission response from API:', data);
      // Optionally refresh the event data to reflect any changes
      this.getEventData();
    })
    .catch(error => {
      console.error('Error submitting attendance to API:', error);
    });
  }
}
