
import React from 'react';
import { Layout } from '../components/Layout';
import { TripCard } from '../components/TripCard';
import { Trip, Balance } from '../types';
import { Plus, Link as LinkIcon } from 'lucide-react';

interface HomeProps {
  trips: Trip[];
  onAddTrip: () => void;
  onJoinTrip: () => void;
  onTripClick: (id: string) => void;
  calculateBalances: (trip: Trip) => Balance[];
}

export const Home: React.FC<HomeProps> = ({ trips, onAddTrip, onJoinTrip, onTripClick, calculateBalances }) => {
  return (
    <Layout title="Your Trips">
      <div className="px-5 py-6">
        <div className="flex gap-3 mb-8">
           <button 
            onClick={onAddTrip}
            className="flex-1 bg-[#FC8019] text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 swiggy-shadow active:scale-95 transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            Create Trip
          </button>
          <button 
            onClick={onJoinTrip}
            className="flex-1 bg-white text-[#282C3F] border border-gray-100 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 swiggy-shadow active:scale-95 transition-all"
          >
            <LinkIcon size={20} strokeWidth={2.5} />
            Join Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-[#F1F1F6] rounded-full flex items-center justify-center mb-6 text-5xl">
              🗺️
            </div>
            <h2 className="text-xl font-extrabold text-[#282C3F] mb-2 tracking-tight">Ready for adventure?</h2>
            <p className="text-[#686B78] max-w-[240px] leading-relaxed text-sm font-medium">
              Track group expenses smoothly and settle up without the awkward math.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#686B78] px-1 mb-3">Recent Trips</h3>
            {trips.map(trip => {
              const balances = calculateBalances(trip);
              const userBalance = balances.find(b => b.personId === '1')?.net || 0;
              return (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  userBalance={userBalance}
                  onClick={() => onTripClick(trip.id)} 
                />
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
