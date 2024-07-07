import { Event } from 'ws';
import { Queue, QueueDecorator } from 'ts-queue';
import ChainOfResponsability from './chainOfResponsability';

export default class Observer extends QueueDecorator<Event> {
  private cof!: ChainOfResponsability;

  constructor(queue: Queue<Event>) {
    super(queue);
  }

  public update(...datas: Event[]): void {
    const isEmpty = this.isEmpty();

    this.enqueue(...datas);
    if (isEmpty) this.empty();
  }

  private async empty(): Promise<void> {
    while (!this.isEmpty()) {
      const data = this.dequeue();

      if (data) this.cof.execute(data);
    }
  }

  public set setCof(cof: ChainOfResponsability) {
    this.cof = cof;
  }
}
