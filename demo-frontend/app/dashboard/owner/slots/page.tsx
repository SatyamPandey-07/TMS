'use client';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface Turf {
  _id: string;
  name: string;
  location: string;
  sport: string;
  pricePerHour: number;
  openHour: number;
  closeHour: number;
  lunchBreak: {
    from: number;
    to: number;
  };
}

interface Slot {
  _id: string;
  turfId: string;
  date: string;
  timeSlot: string;
  startHour: number;
  endHour: number;
  isBooked: boolean;
  booked: boolean;
  bookedBy?: string;
}

export default function ManageSlotsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingSlots, setCreatingSlots] = useState(false);

  // Slot generation form state
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');
  const [turfDetails, setTurfDetails] = useState<Turf | null>(null);

  // Slot filter state
  const [filterType, setFilterType] = useState<'all' | 'today' | 'tomorrow' | 'custom'>('all');
  const [customFilterDate, setCustomFilterDate] = useState('');

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get('/api/fetch-turf');
        setTurfs(res.data.turfs);
      } catch (err) {
        setError('Failed to fetch turfs');
      }
    };
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (selectedTurf) {
      fetchSlots();
      // Find and set turf details for validation
      const turf = turfs.find((t) => t._id === selectedTurf);
      setTurfDetails(turf || null);
      setError('');
      // Reset filters on turf change
      setFilterType('all');
      setCustomFilterDate('');
    }
  }, [selectedTurf, turfs]);

  const fetchSlots = async () => {
    if (!selectedTurf) return;
    setLoadingSlots(true);
    try {
      const res = await axios.get(`/api/slots/${selectedTurf}`);
      setSlots(res.data.slots);
    } catch (err) {
      setError('Failed to fetch slots');
    }
    setLoadingSlots(false);
  };

  // Filter slots based on filterType and customFilterDate
  const filteredSlots = useMemo(() => {
    if (filterType === 'all') {
      return slots; // All dates
    }

    const todayStr = dayjs().format('YYYY-MM-DD');
    const tomorrowStr = dayjs().add(1, 'day').format('YYYY-MM-DD');

    let filterDate = '';

    if (filterType === 'today') {
      filterDate = todayStr;
    } else if (filterType === 'tomorrow') {
      filterDate = tomorrowStr;
    } else if (filterType === 'custom') {
      filterDate = customFilterDate;
    }

    if (!filterDate) return slots;

    return slots.filter(slot => slot.date === filterDate);
  }, [filterType, customFilterDate, slots]);

  const generateSlots = async () => {
    setError('');

    if (!date || !fromTime || !toTime) {
      setError('Please fill date, from time, and to time.');
      return;
    }

    const fromNum = Number(fromTime);
    const toNum = Number(toTime);

    if (isNaN(fromNum) || isNaN(toNum)) {
      setError('From and To time must be valid numbers.');
      return;
    }

    if (fromNum >= toNum) {
      setError('From time must be less than To time.');
      return;
    }

    if (!turfDetails) {
      setError('Turf details not loaded. Please reselect turf.');
      return;
    }

    if (fromNum < turfDetails.openHour || toNum > turfDetails.closeHour) {
      setError(`Slots must be within turf open hours (${turfDetails.openHour} - ${turfDetails.closeHour}).`);
      return;
    }

    if (fromNum < turfDetails.lunchBreak.to && toNum > turfDetails.lunchBreak.from) {
      setError(`Slots cannot overlap lunch break (${turfDetails.lunchBreak.from} - ${turfDetails.lunchBreak.to}).`);
      return;
    }

    setCreatingSlots(true);
    try {
      await axios.post(`/api/slots/${selectedTurf}`, {
        date,
        fromTime: fromNum,
        toTime: toNum,
      });
      await fetchSlots();
      setDate('');
      setFromTime('');
      setToTime('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to generate slots');
    }
    setCreatingSlots(false);
  };

  const deleteSlot = async (slotId: string) => {
    try {
      await axios.delete(`/api/slots/delete/${slotId}`);
      fetchSlots();
    } catch {
      setError('Failed to delete slot');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Manage Turf Slots</h2>

      <select
        className="select select-bordered w-full mb-6"
        onChange={(e) => setSelectedTurf(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select a Turf
        </option>
        {turfs.map((turf) => (
          <option key={turf._id} value={turf._id}>
            {turf.name}
          </option>
        ))}
      </select>

      {selectedTurf && turfDetails && (
        <div className="mb-6 text-center space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered w-full max-w-xs mx-auto"
            max="2099-12-31"
          />

          <div className="flex justify-center gap-2 mx-auto max-w-xs mt-2">
            <input
              type="number"
              step="0.5"
              min={turfDetails.openHour}
              max={turfDetails.closeHour}
              placeholder={`From (e.g. ${turfDetails.openHour})`}
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="input input-bordered w-24 text-center"
            />
            <input
              type="number"
              step="0.5"
              min={turfDetails.openHour}
              max={turfDetails.closeHour}
              placeholder={`To (e.g. ${turfDetails.closeHour})`}
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="input input-bordered w-24 text-center"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            className={`btn btn-primary mt-4 ${creatingSlots ? 'loading' : ''}`}
            onClick={generateSlots}
            disabled={creatingSlots}
          >
            {creatingSlots ? 'Generating...' : 'Generate Slots'}
          </button>
        </div>
      )}

      {/* Date Filter Section */}
      {selectedTurf && slots.length > 0 && (
        <div className="mb-4 max-w-xs mx-auto text-center space-y-2">
          <label htmlFor="slot-filter" className="font-semibold">
            Filter slots by date:
          </label>
          <select
            id="slot-filter"
            className="select select-bordered w-full"
            value={filterType}
            onChange={(e) => {
              const val = e.target.value as 'all' | 'today' | 'tomorrow' | 'custom';
              setFilterType(val);
              if (val !== 'custom') setCustomFilterDate('');
            }}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="custom">Choose Date</option>
          </select>

          {filterType === 'custom' && (
            <input
              type="date"
              value={customFilterDate}
              onChange={(e) => setCustomFilterDate(e.target.value)}
              className="input input-bordered w-full mt-2"
              max="2099-12-31"
            />
          )}
        </div>
      )}

      {loadingSlots ? (
        <p className="text-center text-gray-500">Loading slots...</p>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Generated Slots</h3>

          {filteredSlots.length === 0 ? (
            <p className="text-center text-gray-500">No slots found for selected date filter.</p>
          ) : (
            <ul className="space-y-3 max-w-md mx-auto">
              {filteredSlots.map((slot) => (
                <li
                  key={slot._id}
                  className={`flex justify-between items-center p-3 rounded-md shadow-md transition ${
                    slot.booked ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-md font-medium text-gray-800">
                      {slot.startHour} - {slot.endHour}
                    </span>
                    {slot.isBooked ? (
                      <span className="badge badge-error text-white">Booked</span>
                    ) : (
                      <span className="badge badge-success">Available</span>
                    )}
                  </div>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteSlot(slot._id)}
                    disabled={slot.isBooked}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
