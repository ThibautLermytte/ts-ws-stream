import { LinkedListQueue } from 'ts-queue';
import EventEmitter from 'events';
import Observer from './observer';
import Socket from './socket';
import ChainOfResponsability from './chainOfResponsability';
import Handler from './chainOfResponsability/handler';

export default class Stream {
  private sockets!: Socket[];
  private event!: EventEmitter;
  private observer: Observer;

  constructor(...urls: string[]) {
    this.initObserver();
    this.initEventEmiter();
    this.buildSockets(urls);
  }

  private initObserver(): void {
    this.observer = new Observer(new LinkedListQueue());
    this.observer.setCof = new ChainOfResponsability();
  }

  private initEventEmiter(): void {
    this.event = new EventEmitter();
    this.event.on('error', (error: Error) => this.stop(error));
  }

  private buildSockets(urls: string[]): void {
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

  public addHandler(...handlers: Handler[]): void {
    handlers.forEach((handler) => this.observer.addHandler(handler));
  }
}
