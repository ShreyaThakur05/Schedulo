import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useMeetings(status) {
  return useQuery({ queryKey: ['meetings', status], queryFn: async () => (await api.get(`/meetings?status=${status}`)).data.data });
}
export function useCancelMeeting() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, reason }) => (await api.patch(`/meetings/${id}/cancel`, { cancellationReason: reason })).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['meetings'] }) });
}
export function useRescheduleMeeting() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, newStartTime }) => (await api.patch(`/meetings/${id}/reschedule`, { newStartTime })).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['meetings'] }) });
}
