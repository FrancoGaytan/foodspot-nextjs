import { IOption, ISurveyParticipant } from '@models/options';
import { deleteServer, getServer, postServer, putServer } from './httpServer';

export async function createOption(eventId: string, title: string, signal?: AbortSignal): Promise<IOption> {
  return await postServer<IOption, { title: string }>(`/options/createOption/${eventId}`, { title }, signal);
}

export async function editOption(optionId: string, payload: { title?: string; participants?: string[] }, signal?: AbortSignal): Promise<IOption> {
  return await putServer<IOption, typeof payload>(`/options/editOption/${optionId}`, payload, signal);
}

export async function deleteOption(optionId: string, signal?: AbortSignal): Promise<IOption> {
  return await deleteServer<IOption>(`/options/deleteOption/${optionId}`, signal);
}

export async function getMembersWhoHaventVoted(eventId: string, signal?: AbortSignal): Promise<{ membersWhoHaventVoted: ISurveyParticipant[] }> {
  return await getServer<{ membersWhoHaventVoted: ISurveyParticipant[] }>(`/options/getMembersWhoHaventVoted/${eventId}`, signal);
}
