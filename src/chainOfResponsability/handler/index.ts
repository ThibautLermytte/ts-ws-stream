import { Event } from 'ws';

export default abstract class Handler {
  protected _next: Handler | null = null;

  public abstract handle(event: Event): void;

  public set next(handler: Handler) {
    this._next = handler;
  }
}
