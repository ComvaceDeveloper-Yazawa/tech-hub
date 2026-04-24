import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';

export interface IDomainEventPublisher {
  publishAll(events: DomainEvent[]): Promise<void>;
}
