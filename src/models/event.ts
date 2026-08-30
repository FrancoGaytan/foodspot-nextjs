import { EventStatesEnum } from '../enums/EventState.enum';
import { EventRatingData } from './ratings';
import { IUser } from './user';
import { IOption } from './options';
import { IPurchaseReceipt } from './purchases';

export interface IEvent {
  title: string;
  chef: IUser | null;
  datetime: Date;
  description: string;
  memberLimit: number;
  state: string;
  members: IUser[];
  organizer: IUser;
  shoppingDesignee: IUser[];
  transferReceipts: [];
  purchaseReceipts: IPurchaseReceipt[];
  ratings: [];
  options?: IOption[];
  _id: string;
  __v: 0;
  isPrivate?: boolean;
  penalization: number;
  penalizationStartDate: Date;
}

export interface IPublicEvent {
  chef: string;
  datetime: Date;
  description: string;
  shoppingDesignee?: IUser[];
  members: number;
  memberLimit: number;
  state: EventStatesEnum;
  title: string;
  _id: string;
  isPrivate: boolean;
  ratings: EventRatingData;
}

export interface IEventHomeDetails {
  _id: string;
  memberLimit: number;
  state: string;
  members: Pick<IUser, '_id'>[];
  isPrivate?: boolean;
}
