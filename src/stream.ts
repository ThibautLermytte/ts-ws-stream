import { LinkedListQueue } from 'ts-queue';
import Observer from './observer';
import Socket from './socket';
import ChainOfResponsability from './chainOfResponsability';
import Handler from './chainOfResponsability/handler';
import StreamErrorEmitter from './streamErrorEmitter';

export default class Stream {
  private sockets!: Socket[];
  private observer!: Observer;

  constructor(...urls: string[]) {
    StreamErrorEmitter.set((error) => this.stop(error));
    this.initObserver();
    this.buildSockets(urls);
  }

  private initObserver(): void {
    this.observer = new Observer(new LinkedListQueue());
    this.observer.setCof = new ChainOfResponsability();
  }

  private buildSockets(urls: string[]): void {
    this.sockets = urls.map((url) => {
      const socket = new Socket(url);

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

  public stopByUrl(url: string): void {
    const socket = this.sockets.find((socket) => socket.url === url);

    if (socket) socket.stop();
    else console.info('No socket found with this url.');
  }

  public addHandler(...handlers: Handler[]): void {
    handlers.forEach((handler) => this.observer.addHandler(handler));
  }
}
