import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useEventTypes() {
  return useQuery({ queryKey: ['eventTypes'], queryFn: async () => (await api.get('/event-types')).data.data });
}
export function useEventTypeBySlug(slug) {
  return useQuery({ queryKey: ['eventType', slug], queryFn: async () => (await api.get(`/event-types/slug/${slug}`)).data.data, enabled: !!slug });
}
export function useCreateEventType() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data) => (await api.post('/event-types', data)).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['eventTypes'] }) });
}
export function useUpdateEventType() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, ...data }) => (await api.put(`/event-types/${id}`, data)).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['eventTypes'] }) });
}
export function useDeleteEventType() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id) => api.delete(`/event-types/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['eventTypes'] }) });
}
