import EventEmitter from 'events';

export default class StreamErrorEmitter extends EventEmitter {
  private static _instance: StreamErrorEmitter;
  private event!: EventEmitter;

  private constructor(stop: (error: Error) => void) {
    super();
    this.event = new EventEmitter();
    this.event.on('error', (error: Error) => stop(error));
  }

  public static set(stop: (error: Error) => void): void {
    if (!this._instance) this._instance = new StreamErrorEmitter(stop);
  }

  public static emit(error: any): void {
    if (StreamErrorEmitter._instance)
      StreamErrorEmitter._instance.event.emit('error', error);
    else console.info('You must instanciate StreamErrorEmitter');
  }
}
