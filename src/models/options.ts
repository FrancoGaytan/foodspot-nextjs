import { IPublicUser } from './user';

export interface IOption {
  _id: string;
  title: string;
  participants: Pick<IPublicUser, '_id' | 'name' | 'lastName'>[];
}

export interface ISurveyParticipant {
  _id: string;
  name: string;
  lastName?: string;
}
