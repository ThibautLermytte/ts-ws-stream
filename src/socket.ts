import WebSocket, { Event, MessageEvent, ErrorEvent, CloseEvent } from 'ws';
import Observer from './observer';
import EventEmitter from 'events';

export default class Socket {
  private ws!: WebSocket;
  private observer!: Observer;

  constructor(public readonly url: string, private stream: EventEmitter) {}

  private get open(): boolean {
    return this.ws && this.ws.readyState < 2;
  }

  private reconnect(): void {
    if (!this.open) {
      this.start();
      console.info(`Reconnection ${this.url}`, new Date().toLocaleString());
    }
  }

  public static send(target: WebSocket, data: string | object): void {
    if (target.readyState === WebSocket.OPEN) {
      if (typeof data !== 'string') data = JSON.stringify(data);
      target.send(data);
    } else console.info('The websocket is not open yet.');
  }

  public start(): void {
    this.ws = new WebSocket(this.url);
    this.ws.on('reconnect', () => this.reconnect());
    this.ws.on('message.error', (error) => this.stream.emit('error', error));
    this.ws.onopen = (event: Event) => this.observer.update(event);
    this.ws.onmessage = (event: MessageEvent) => this.observer.update(event);
    this.ws.onclose = (event: CloseEvent) => this.observer.update(event);
    this.ws.onerror = (event: ErrorEvent) => this.observer.update(event);
  }

  public stop(): void {
    if (this.open) this.ws.close();
  }

  public set setObserver(observer: Observer) {
    this.observer = observer;
  }
}
