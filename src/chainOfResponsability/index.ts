import { Event } from 'ws';
import Handler from './handler';
import Monitor from './handler/monitor';

export default class ChainOfResponsability {
  private front: Handler | null = null;
  private rear: Handler | null = null;

  constructor(monitor?: Handler) {
    this.addHandler(monitor ?? new Monitor());
  }

  public execute(event: Event) {
    if (this.front) this.front.handle(event);
  }

  public addHandler(handler: Handler): void {
    if (this.front === null) this.front = this.rear = handler;
    else if (this.rear) {
      this.rear.next = handler;
      this.rear = handler;
    }
  }
}
