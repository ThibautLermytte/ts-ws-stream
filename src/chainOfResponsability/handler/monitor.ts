import Handler from '.';
import { Event, CloseEvent, ErrorEvent } from 'ws';
import StreamErrorEmitter from '../../streamErrorEmitter';

export default class Monitor extends Handler<Event, Event> {
  public handle(event: Event): void {
    if (event.type === 'error') this.stop(event as ErrorEvent);
    else if (event.type === 'close') this.reconnect(event as CloseEvent);
    this.nextHandler(event);
  }

  private stop(event: ErrorEvent): void {
    StreamErrorEmitter.emit(event.error);
  }

  private reconnect(event: CloseEvent): void {
    if (!event.wasClean) event.target.emit('reconnect');
  }
}
