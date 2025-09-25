import { identifierName } from '@angular/compiler';
import moment from 'moment';

export class PlannedEvent {
  id: number|null;
  name: string;
  date: Date; 
  description: string;
  selected: boolean;
  numberOfAttendees?: number;

  constructor(date: Date, id?: number, name?: string, description?: string, selected?: boolean, numberOfAttendees?: number) {
    this.id = id || null;
    this.name = name || 'New Event';
    this.date = date;
    this.description = description || 'This is an event planned for ' + date.toDateString();
    this.selected = selected || false;
    this.numberOfAttendees = numberOfAttendees || 0;
  }

  toString(): string {
    return `${this.name} on ${this.date.toDateString()}: ${this.description}`;
  }

  toJSON() {
    // The times need to be timestamps for MySQL
    return {
      name: this.name,
      start: moment(this.date).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(this.date).format('YYYY-MM-DD HH:mm:ss'),
      description: this.description,
      selected: this.selected,
      numberOfAttendees: this.numberOfAttendees
    };
  }
}