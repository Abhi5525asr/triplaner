
import { useState, useEffect } from 'react';
import { Trip, Expense, Person, Balance, SettlementRecord } from './types';

const STORAGE_KEY = 'tripsplit_data_v2';

export const useTripStore = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const addExpense = (tripId: string, expense: Expense) => {
    setTrips(prev => prev.map(t => 
      t.id === tripId ? { ...t, expenses: [expense, ...t.expenses] } : t
    ));
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
     setTrips(prev => prev.map(t => 
      t.id === tripId ? { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) } : t
    ));
  };

  const addSettlement = (tripId: string, settlement: SettlementRecord) => {
    setTrips(prev => prev.map(t => 
      t.id === tripId ? { ...t, settlements: [settlement, ...t.settlements] } : t
    ));
  };

  const getTrip = (id: string) => trips.find(t => t.id === id);

  const calculateBalances = (trip: Trip): Balance[] => {
    const data: Record<string, { paid: number; share: number; settledPaid: number; settledReceived: number }> = {};
    
    trip.people.forEach(p => {
      data[p.id] = { paid: 0, share: 0, settledPaid: 0, settledReceived: 0 };
    });

    // Process Expenses
    trip.expenses.forEach(e => {
      e.payments.forEach(p => {
        if (data[p.personId]) data[p.personId].paid += p.amount;
      });
      e.splitWith.forEach(s => {
        if (data[s.personId]) data[s.personId].share += s.amount;
      });
    });

    // Process Settlements
    trip.settlements.forEach(s => {
      if (data[s.fromId]) data[s.fromId].settledPaid += s.amount;
      if (data[s.toId]) data[s.toId].settledReceived += s.amount;
    });

    return trip.people.map(p => {
      const d = data[p.id];
      // Net = (What I actually paid + What I gave to others) - (My share of costs + What I received from others)
      const net = (d.paid + d.settledPaid) - (d.share + d.settledReceived);
      return {
        personId: p.id,
        totalPaid: d.paid,
        totalShare: d.share,
        totalSettledPaid: d.settledPaid,
        totalSettledReceived: d.settledReceived,
        net
      };
    });
  };

  return {
    trips,
    addTrip,
    addExpense,
    deleteExpense,
    addSettlement,
    getTrip,
    calculateBalances,
    activeTripId,
    setActiveTripId
  };
};
