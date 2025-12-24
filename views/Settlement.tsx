
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Trip, Balance, SettlementRecord, PaymentMethod } from '../types';
import { BottomSheet } from '../components/BottomSheet';
import { CheckCircle2, History, Send, Smartphone, Banknote, CreditCard, Wallet } from 'lucide-react';

interface SettlementProps {
  trip: Trip;
  balances: Balance[];
  onBack: () => void;
  onAddSettlement: (settlement: SettlementRecord) => void;
}

export const Settlement: React.FC<SettlementProps> = ({ trip, balances, onBack, onAddSettlement }) => {
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [settleFrom, setSettleFrom] = useState(trip.people[0].id);
  const [settleTo, setSettleTo] = useState(trip.people[1].id);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState<PaymentMethod>('UPI');

  const handleSettle = () => {
    if (!settleAmount || settleFrom === settleTo) return;
    
    const record: SettlementRecord = {
      id: Date.now().toString(),
      fromId: settleFrom,
      toId: settleTo,
      amount: parseFloat(settleAmount),
      date: Date.now(),
      method: settleMethod
    };

    onAddSettlement(record);
    setIsSettleOpen(false);
    setSettleAmount('');
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI': return <Smartphone size={14} />;
      case 'Cash': return <Banknote size={14} />;
      case 'Card': return <CreditCard size={14} />;
      case 'Wallet': return <Wallet size={14} />;
    }
  };

  return (
    <Layout title="Balances & Settle" onBack={onBack}>
      <div className="bg-[#F1F1F6] min-h-full pb-20">
        <div className="bg-[#282C3F] p-8 rounded-b-[40px] text-white swiggy-shadow mb-8 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Settlement Hub</p>
          <h2 className="text-3xl font-black tracking-tighter">{trip.people.length} Group Members</h2>
        </div>

        <div className="px-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center px-1">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#686B78]">Who owes what</h3>
               <button onClick={() => setIsSettleOpen(true)} className="text-[11px] font-black uppercase text-[#FC8019]">Settle Up</button>
             </div>
             
             {balances.map(b => {
               const p = trip.people.find(person => person.id === b.personId)!;
               return (
                 <div key={b.personId} className="bg-white p-5 rounded-[32px] swiggy-shadow border border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white shadow-inner" style={{ backgroundColor: p.avatarColor }}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-[#282C3F] text-lg leading-tight">{p.name} {b.personId === '1' && '(You)'}</h4>
                          <p className="text-[11px] text-[#686B78] font-bold">Total Spent: {trip.currency}{b.totalPaid.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {Math.abs(b.net) < 0.1 ? (
                          <div className="flex items-center gap-1.5 text-[#60B246] font-black text-sm uppercase">
                            <CheckCircle2 size={16} /> Settled
                          </div>
                        ) : b.net > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[#60B246] font-black text-xl tracking-tighter">+{trip.currency}{Math.round(b.net).toLocaleString()}</span>
                            <span className="text-[9px] font-black text-[#60B246] uppercase tracking-widest">Gets Back</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[#EC3838] font-black text-xl tracking-tighter">-{trip.currency}{Math.round(Math.abs(b.net)).toLocaleString()}</span>
                            <span className="text-[9px] font-black text-[#EC3838] uppercase tracking-widest">Owes</span>
                          </div>
                        )}
                      </div>
                    </div>
                 </div>
               );
             })}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#686B78] px-1">Recent Settlements</h3>
            {trip.settlements.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center border-2 border-dashed border-gray-200 opacity-50">
                <span className="text-3xl mb-2 block">💸</span>
                <p className="text-xs font-bold uppercase tracking-widest">No payments recorded yet</p>
              </div>
            ) : (
              trip.settlements.map(s => {
                const from = trip.people.find(p => p.id === s.fromId)?.name;
                const to = trip.people.find(p => p.id === s.toId)?.name;
                return (
                  <div key={s.id} className="bg-white px-5 py-4 rounded-2xl swiggy-shadow flex items-center justify-between border border-gray-50">
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-[#F1F1F6] rounded-xl text-[#282C3F]">
                         {getMethodIcon(s.method)}
                       </div>
                       <div>
                         <p className="text-xs font-bold text-[#282C3F]">{from} paid {to}</p>
                         <p className="text-[9px] font-bold text-[#686B78] uppercase">{s.method} • {new Date(s.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <span className="text-[#60B246] font-black text-base">{trip.currency}{s.amount}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <BottomSheet isOpen={isSettleOpen} onClose={() => setIsSettleOpen(false)} title="Record a Payment">
        <div className="flex flex-col gap-8 pt-4">
          <div className="text-center">
             <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78] mb-1">Settlement Amount</p>
             <div className="flex items-center justify-center gap-1">
               <span className="text-3xl font-black text-[#282C3F]/40">{trip.currency}</span>
               <input 
                autoFocus
                type="number"
                placeholder="0"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-48 text-6xl font-black text-[#282C3F] bg-transparent border-none outline-none text-center tracking-tighter"
               />
             </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Who Paid?</label>
                <select 
                  value={settleFrom}
                  onChange={(e) => setSettleFrom(e.target.value)}
                  className="w-full bg-[#F1F1F6] border-none rounded-2xl px-4 py-4 outline-none text-[#282C3F] font-bold appearance-none"
                >
                  {trip.people.map(p => (
                    <option key={p.id} value={p.id}>{p.id === '1' ? 'You' : p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Paid To?</label>
                <select 
                  value={settleTo}
                  onChange={(e) => setSettleTo(e.target.value)}
                  className="w-full bg-[#F1F1F6] border-none rounded-2xl px-4 py-4 outline-none text-[#282C3F] font-bold appearance-none"
                >
                  {trip.people.map(p => (
                    <option key={p.id} value={p.id}>{p.id === '1' ? 'You' : p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {(['UPI', 'Cash', 'Card', 'Wallet'] as PaymentMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setSettleMethod(m)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${settleMethod === m ? 'bg-[#FC8019] border-[#FC8019] text-white swiggy-shadow' : 'bg-white border-gray-100 text-gray-400'}`}
                  >
                    {getMethodIcon(m)}
                    <span className="text-[9px] font-black uppercase">{m}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSettle}
              disabled={!settleAmount || settleFrom === settleTo}
              className="w-full bg-[#FC8019] text-white py-5 rounded-[24px] font-black text-lg swiggy-shadow disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Confirm Settlement <Send size={20} />
            </button>
          </div>
        </div>
      </BottomSheet>
    </Layout>
  );
};
