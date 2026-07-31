'use client';

import { IEventHomeDetails } from '@models/event';
import { subscribeToAnEventAction } from 'app/[lang]/event/actions';
import { showToast, ToastType } from '@utils/services/toastService';
import { useState } from 'react';
import { useTranslation } from './useTranslation';
import { useCustomRouter } from './useCustomRouter';

interface useEventHomeParams {
  eventId: string;
  userId: string;
  initialEvent: IEventHomeDetails | null;
  debtorEventId: string | null;
}

export enum EventStatus {
  AVAILABLE = 'available',
  SUBSCRIBED = 'subscribed',
  FULL = 'full',
  CANCELED = 'canceled',
  CLOSED = 'closed',
  FINISHED = 'finished',
  READY_FOR_PAYMENT = 'readyforpayment',
  DEBTOR = 'debtor',
  BLOCKED = 'blocked',
}

export function useEventHome(props: useEventHomeParams) {
  const [currentEvent] = useState<IEventHomeDetails | null>(props.initialEvent);
  const userDebtor = props.debtorEventId;
  const { t } = useTranslation('eventHome');
  const { pushTo } = useCustomRouter();

  const isUserIntoEvent = currentEvent?.members.some(member => member._id === props.userId) ?? false;

  const isEventFull = (): boolean => {
    return Number(currentEvent?.members.length) >= Number(currentEvent?.memberLimit);
  };

  function subscribeUserToEvent(): void {
    if (!props.userId || !props.eventId) return;

    subscribeToAnEventAction(props.userId, props.eventId)
      .then(() => {
        pushTo(`/event/${props.eventId}`);
        showToast(t.userAddedSuccessfully, ToastType.SUCCESS);
      })
      .catch(() => showToast(t.userAddingFailure, ToastType.ERROR));
  }

  const handleParticipation = () => {
    if (props.userId) {
      subscribeUserToEvent();
    } else {
      showToast(t.noLoggedMsgParticipate, ToastType.ERROR);
    }
  };

  const handleInfo = () => {
    if (currentEvent) {
      pushTo(`/event/${currentEvent._id}`);
    } else {
      showToast(t.noLoggedMsg, ToastType.ERROR);
    }
  };

  const getMyEventStatus = (): EventStatus => {
    if (userDebtor) {
      return userDebtor === currentEvent?._id ? EventStatus.DEBTOR : EventStatus.BLOCKED;
    }
    switch (currentEvent?.state) {
      case 'available':
        return isUserIntoEvent ? EventStatus.SUBSCRIBED : isEventFull() ? EventStatus.FULL : EventStatus.AVAILABLE;
      case 'closed':
        return isUserIntoEvent ? EventStatus.SUBSCRIBED : EventStatus.CLOSED;
      case 'canceled':
        return EventStatus.CANCELED;
      case 'finished':
        return EventStatus.FINISHED;
      case 'readyforpayment':
        return isUserIntoEvent ? EventStatus.READY_FOR_PAYMENT : EventStatus.CLOSED;
      default:
        return EventStatus.AVAILABLE;
    }
  };
  const userStatusInEvent: EventStatus = getMyEventStatus();
  const isLoading = !currentEvent;

  return { userStatusInEvent, currentEvent, isUserIntoEvent, handleParticipation, handleInfo, isLoading };
}
