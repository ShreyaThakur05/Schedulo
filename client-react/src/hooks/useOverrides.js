import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useOverrides() {
  return useQuery({ queryKey: ['overrides'], queryFn: async () => (await api.get('/availability/overrides')).data.data });
}
export function useUpsertOverride() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data) => (await api.put('/availability/overrides', data)).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['overrides'] }) });
}
export function useDeleteOverride() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (date) => api.delete(`/availability/overrides/${date}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['overrides'] }) });
}
export function useGCalStatus() {
  return useQuery({ queryKey: ['gcal-status'], queryFn: async () => (await api.get('/gcal/status')).data.data });
}
export function useGCalDisconnect() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async () => api.delete('/gcal/disconnect'), onSuccess: () => qc.invalidateQueries({ queryKey: ['gcal-status'] }) });
}
