import { Event } from 'ws';

export default abstract class Handler {
  private _next: Handler | null = null;

  public abstract handle(event: Event): void;

  public nextHandler(event: Event): void {
    if (this._next) this._next.handle(event);
  }

  public set next(handler: Handler) {
    this._next = handler;
  }
}
