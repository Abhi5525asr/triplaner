
import React from 'react';
import { Trip, Balance } from '../types';
import { COLORS } from '../constants';

interface TripCardProps {
  trip: Trip;
  userBalance: number;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, userBalance, onClick }) => {
  const totalExpense = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[20px] p-4 swiggy-shadow border border-gray-50 flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer mb-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#282C3F] line-clamp-1 mb-0.5">{trip.name}</h3>
          <p className="text-sm text-[#686B78]">{trip.people.length} people • {trip.expenses.length} expenses</p>
        </div>
        <div className="bg-[#F1F1F6] p-2.5 rounded-2xl">
          <span className="text-lg">🏕️</span>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 w-full" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#686B78] mb-1">Total Trip Expense</p>
          <p className="text-xl font-extrabold text-[#282C3F]">
            {trip.currency}{totalExpense.toLocaleString()}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#686B78] mb-1">Your Balance</p>
          {userBalance === 0 ? (
            <p className="text-sm font-semibold text-[#686B78]">Settled up</p>
          ) : userBalance > 0 ? (
            <p className="text-sm font-bold text-[#60B246]">You get {trip.currency}{Math.abs(userBalance)}</p>
          ) : (
            <p className="text-sm font-bold text-[#EC3838]">You owe {trip.currency}{Math.abs(userBalance)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
