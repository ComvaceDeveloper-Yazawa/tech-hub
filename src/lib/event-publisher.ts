import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';

export class NoopDomainEventPublisher implements IDomainEventPublisher {
  async publishAll(_events: DomainEvent[]): Promise<void> {
    // TODO: Implement actual event publishing
  }
}
