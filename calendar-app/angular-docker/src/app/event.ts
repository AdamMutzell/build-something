import moment from 'moment';

export class PlannedEvent {
  name: string;
  date: Date; 
  description: string;

  constructor(date: Date) {
    this.name = 'New Event';
    this.date = date;
    this.description = 'This is an event planned for ' + date.toDateString();
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
      description: this.description
    };
  }
}