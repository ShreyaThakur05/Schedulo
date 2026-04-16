import { motion } from 'framer-motion';
import { useSlots } from '../../hooks/useSlots';
import { Spinner } from '../ui/index';
import { formatLocalTime } from '../../lib/utils';

export default function TimeSlotPicker({ date, eventTypeId, onSlotSelect, selectedSlot }) {
  const { data: slots, isLoading, isError } = useSlots(date, eventTypeId);
  if (isLoading) return <div className="flex items-center justify-center py-12"><Spinner /></div>;
  if (isError) return <p className="text-sm text-red-500 text-center py-8">Failed to load slots.</p>;
  if (!slots || slots.length === 0) return <div className="text-center py-8"><p className="text-[#6b6b8a] text-sm">No available slots for this date.</p></div>;
  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot, i) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;
        return (
          <motion.button key={slot.startTime} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => onSlotSelect(slot)} whileTap={{ scale: 0.97 }}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all border ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-[#1e1e2a] text-[#1a1523] dark:text-[#f0eeff] border-[#e8e6f0] dark:border-[#2a2a3a] hover:border-indigo-400 hover:text-indigo-600'}`}>
            {formatLocalTime(slot.startTime)}
          </motion.button>
        );
      })}
    </div>
  );
}
