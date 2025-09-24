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
import { PlannedEvent } from '../event';

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
    InputTextModule
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

    fetch('http://127.0.0.1:3000/fetch_events/', {
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
      this.events = parsedData.map((event: any) => new PlannedEvent(new Date(event.start)));
    })
    .catch(error => {
      console.error('Error calling API:', error);
    });
  }
}
