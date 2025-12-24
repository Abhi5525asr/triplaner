
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { BottomSheet } from '../components/BottomSheet';
import { Trip, Expense, Category, Balance, PaymentMethod, PaymentPart } from '../types';
import { CATEGORIES, PAYMENT_TYPES } from '../constants';
import { Plus, Users, Trash2, ChevronRight, Info, CheckCircle2, History } from 'lucide-react';

interface TripDashboardProps {
  trip: Trip;
  onBack: () => void;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  balances: Balance[];
  onOpenSettlement: () => void;
}

export const TripDashboard: React.FC<TripDashboardProps> = ({ 
  trip, 
  onBack, 
  onAddExpense, 
  onDeleteExpense,
  balances,
  onOpenSettlement
}) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // New Expense State
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<Category>('Food');
  const [splitWithIds, setSplitWithIds] = useState<string[]>(trip.people.map(p => p.id));
  
  // Complex Payment State
  const [payments, setPayments] = useState<PaymentPart[]>([
    { personId: '1', amount: 0, method: 'UPI' }
  ]);

  const totalExpense = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const userBalance = balances.find(b => b.personId === '1')?.net || 0;
  const userPaid = balances.find(b => b.personId === '1')?.totalPaid || 0;

  const filteredExpenses = selectedCategory === 'All' 
    ? trip.expenses 
    : trip.expenses.filter(e => e.category === selectedCategory);

  const handleAddExpenseSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || !title || splitWithIds.length === 0) return;
    
    // Auto-distribute payment to first payer if not specified manually (simplified for UX)
    const finalPayments = payments[0].amount === 0 
      ? [{ ...payments[0], amount: numAmount }] 
      : payments;

    const perPersonShare = numAmount / splitWithIds.length;
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount: numAmount,
      date: Date.now(),
      category: cat,
      payments: finalPayments,
      splitWith: splitWithIds.map(id => ({ personId: id, amount: perPersonShare })),
      addedBy: '1'
    };

    onAddExpense(newExpense);
    setIsAddExpenseOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setTitle('');
    setPayments([{ personId: '1', amount: 0, method: 'UPI' }]);
    setSplitWithIds(trip.people.map(p => p.id));
  };

  return (
    <Layout 
      title={trip.name} 
      onBack={onBack}
      actions={
        <button onClick={onOpenSettlement} className="p-2.5 bg-[#F1F1F6] rounded-2xl text-[#282C3F] active:scale-95 transition-all">
          <Users size={20} strokeWidth={2.5} />
        </button>
      }
    >
      <div className="bg-[#F1F1F6] min-h-full pb-24">
        {/* Sticky Header Summary */}
        <div className="sticky top-0 z-30 bg-white px-5 pb-6 pt-3 rounded-b-[32px] swiggy-shadow mb-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Trip Budget Spent</p>
                <h2 className="text-4xl font-black text-[#282C3F] tracking-tight">{trip.currency}{totalExpense.toLocaleString()}</h2>
              </div>
              <div className="bg-[#F1F1F6] px-4 py-2 rounded-xl flex items-center gap-2">
                <History size={14} className="text-[#686B78]" />
                <span className="text-[10px] font-extrabold uppercase text-[#686B78]">{trip.expenses.length} Items</span>
              </div>
            </div>

            <div 
              onClick={onOpenSettlement}
              className={`p-5 rounded-[24px] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all ${userBalance >= 0 ? 'bg-[#60B246]/10 border border-[#60B246]/20' : 'bg-[#EC3838]/10 border border-[#EC3838]/20'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userBalance >= 0 ? 'bg-[#60B246] text-white' : 'bg-[#EC3838] text-white'}`}>
                  {userBalance >= 0 ? <CheckCircle2 size={24} /> : <Info size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60 mb-0.5">Your Status</p>
                  <p className="font-black text-base tracking-tight">
                    {userBalance === 0 ? 'All Settled up' : userBalance > 0 ? `You get back ${trip.currency}${Math.abs(userBalance)}` : `You owe ${trip.currency}${Math.abs(userBalance)}`}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="opacity-30" />
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar mb-8">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-[#FC8019] text-white swiggy-shadow' : 'bg-white text-[#686B78] border border-gray-100'}`}
          >
            All Items
          </button>
          {CATEGORIES.map(c => (
            <button 
              key={c.label}
              onClick={() => setSelectedCategory(c.label)}
              className={`px-6 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${selectedCategory === c.label ? 'bg-[#FC8019] text-white swiggy-shadow' : 'bg-white text-[#686B78] border border-gray-100'}`}
            >
              {c.icon}
              {c.label}
            </button>
          ))}
        </div>

        {/* Expense Feed */}
        <div className="px-5 flex flex-col gap-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#686B78] px-1">Expense History</h3>
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-[32px] py-16 px-10 text-center flex flex-col items-center border border-dashed border-gray-200">
              <span className="text-5xl mb-6 grayscale opacity-50">🧾</span>
              <p className="text-[#686B78] font-bold text-sm">No expenses found here.</p>
            </div>
          ) : (
            filteredExpenses.map(exp => {
              const categoryInfo = CATEGORIES.find(c => c.label === exp.category);
              const mainPayer = trip.people.find(p => p.id === exp.payments[0].personId)?.name || 'Someone';
              const isMultiPayer = exp.payments.length > 1;
              
              return (
                <div key={exp.id} className="bg-white p-5 rounded-[28px] swiggy-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5" style={{ backgroundColor: categoryInfo?.color }}>
                      {categoryInfo?.icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-extrabold text-[#282C3F] text-base truncate mb-0.5">{exp.title}</h4>
                      <p className="text-[11px] text-[#686B78] font-bold flex items-center gap-1">
                        Paid by <span className="text-[#FC8019]">{mainPayer}</span>
                        {isMultiPayer && <span className="bg-gray-100 px-1 rounded text-[9px]">+ Others</span>}
                        <span className="opacity-30">•</span>
                        <span>{exp.splitWith.length} Split</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 ml-3">
                    <p className="font-black text-[#282C3F] text-xl tracking-tighter">{trip.currency}{exp.amount}</p>
                    <button onClick={() => onDeleteExpense(exp.id)} className="p-1.5 text-gray-200 hover:text-[#EC3838] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddExpenseOpen(true)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#FC8019] text-white px-8 py-5 rounded-full font-black flex items-center gap-3 swiggy-shadow active:scale-95 transition-all z-50 shadow-[0_12px_32px_rgba(252,128,25,0.5)]"
      >
        <Plus size={24} strokeWidth={4} />
        Add Expense
      </button>

      {/* Modern Expense Bottom Sheet */}
      <BottomSheet isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="New Expense">
        <div className="flex flex-col gap-8 pt-4">
          <div className="text-center">
             <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78] mb-1">How much did it cost?</p>
             <div className="flex items-center justify-center gap-1">
               <span className="text-3xl font-black text-[#282C3F]/40">{trip.currency}</span>
               <input 
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 text-6xl font-black text-[#282C3F] bg-transparent border-none outline-none text-center tracking-tighter [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
               />
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Expense Details</label>
              <input 
                type="text"
                placeholder="Ex: Seafood Platter 🍱"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F1F1F6] border-none rounded-2xl px-5 py-4 focus:ring-2 ring-[#FC8019] outline-none text-[#282C3F] font-bold text-lg"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Select Category</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setCat(c.label)}
                    className={`flex flex-col items-center gap-2 min-w-[78px] p-4 rounded-[24px] border-2 transition-all ${cat === c.label ? 'bg-[#FC8019] border-[#FC8019] text-white swiggy-shadow' : 'bg-white border-gray-100 text-gray-400'}`}
                  >
                    {c.icon}
                    <span className="text-[10px] font-extrabold uppercase">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Paid By</label>
                <select 
                  className="w-full bg-[#F1F1F6] border-none rounded-2xl px-4 py-4 outline-none text-[#282C3F] font-bold appearance-none"
                  onChange={(e) => setPayments([{ ...payments[0], personId: e.target.value }])}
                >
                  {trip.people.map(p => (
                    <option key={p.id} value={p.id}>{p.id === '1' ? 'You' : p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Method</label>
                <select 
                  className="w-full bg-[#F1F1F6] border-none rounded-2xl px-4 py-4 outline-none text-[#282C3F] font-bold appearance-none"
                  onChange={(e) => setPayments([{ ...payments[0], method: e.target.value as PaymentMethod }])}
                >
                  {['UPI', 'Cash', 'Card', 'Wallet'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#686B78]">Split Between ({splitWithIds.length})</label>
                <button 
                  onClick={() => setSplitWithIds(splitWithIds.length === trip.people.length ? [] : trip.people.map(p => p.id))}
                  className="text-[10px] font-extrabold text-[#FC8019] uppercase"
                >
                  {splitWithIds.length === trip.people.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trip.people.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSplitWithIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${splitWithIds.includes(p.id) ? 'bg-[#282C3F] border-[#282C3F] text-white' : 'bg-white border-gray-100 text-[#686B78]'}`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: p.avatarColor }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold">{p.id === '1' ? 'You' : p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddExpenseSubmit}
              disabled={!amount || !title || splitWithIds.length === 0}
              className="w-full bg-[#FC8019] text-white py-5 rounded-[24px] font-black text-lg swiggy-shadow disabled:opacity-50 active:scale-[0.98] transition-all mt-4 mb-2 shadow-[0_12px_24px_rgba(252,128,25,0.3)]"
            >
              Save Expense
            </button>
          </div>
        </div>
      </BottomSheet>
    </Layout>
  );
};
