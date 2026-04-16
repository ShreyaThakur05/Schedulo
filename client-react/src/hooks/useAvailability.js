import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useAvailability() {
  return useQuery({ queryKey: ['availability'], queryFn: async () => (await api.get('/availability')).data.data });
}
export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data) => (await api.put('/availability', data)).data.data, onSuccess: () => qc.invalidateQueries({ queryKey: ['availability'] }) });
}
