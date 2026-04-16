import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useSlots(date, eventTypeId) {
  return useQuery({ queryKey: ['slots', date, eventTypeId], queryFn: async () => (await api.get(`/availability/slots?date=${date}&eventTypeId=${eventTypeId}`)).data.data, enabled: !!date && !!eventTypeId, staleTime: 30000 });
}
export function useAvailableDates(eventTypeId, year, month) {
  return useQuery({ queryKey: ['availableDates', eventTypeId, year, month], queryFn: async () => (await api.get(`/availability/dates?eventTypeId=${eventTypeId}&year=${year}&month=${month}`)).data.data, enabled: !!eventTypeId });
}
