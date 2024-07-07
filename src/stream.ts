import { LinkedListQueue } from 'ts-queue';
import EventEmitter from 'events';
import Observer from './observer';
import Socket from './socket';

export default class Stream {
  private sockets!: Socket[];
  private event!: EventEmitter;
  private observer: Observer;

  constructor(...urls: string[]) {
    this.observer = new Observer(new LinkedListQueue());
    this.initEventEmiter();
    this.buildSockets(urls);
  }

  public initEventEmiter(): void {
    this.event = new EventEmitter();
    this.event.on('error', (error: Error) => this.stop(error));
  }

  public buildSockets(urls: string[]): void {
    this.sockets = urls.map((url) => {
      const socket = new Socket(url, this.event);

      socket.setObserver = this.observer;
      return socket;
    });
  }

  public start(): void {
    this.sockets.forEach((socket) => socket.start());
  }

  public stop(reason?: any): void {
    this.sockets.forEach((socket) => socket.stop());
    if (reason) console.error(reason);
  }
}
