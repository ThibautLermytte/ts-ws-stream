export default abstract class Handler<T = any, N = any> {
  private _next: Handler<N> | null = null;

  public abstract handle(event: T): void;

  public nextHandler(event: N): void {
    if (this._next) this._next.handle(event);
  }

  public set next(handler: Handler<N>) {
    this._next = handler;
  }
}
