import { EventStatesEnum } from '../enums/EventState.enum';

export type TEventState =
  | EventStatesEnum.AVAILABLE
  | EventStatesEnum.CLOSED
  | EventStatesEnum.CANCELED
  | EventStatesEnum.FINISHED
  | EventStatesEnum.READY_FOR_PAYMENT;

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.FULL | EventStatesEnum.INCOMPLETED;
