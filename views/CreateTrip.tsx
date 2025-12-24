
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Trip, Person } from '../types';
import { AVATAR_COLORS } from '../constants';
import { X, UserPlus, Share2, QrCode, ArrowRight } from 'lucide-react';

interface CreateTripProps {
  onCancel: () => void;
  onSave: (trip: Trip) => void;
}

export const CreateTrip: React.FC<CreateTripProps> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'You', avatarColor: AVATAR_COLORS[0] }
  ]);
  const [newName, setNewName] = useState('');

  const addPerson = () => {
    if (!newName.trim()) return;
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newName,
      avatarColor: AVATAR_COLORS[people.length % AVATAR_COLORS.length]
    };
    setPeople([...people, newPerson]);
    setNewName('');
  };

  const removePerson = (id: string) => {
    if (id === '1') return;
    setPeople(people.filter(p => p.id !== id));
  };

  const handleFinish = () => {
    if (!name || people.length < 2) return;
    const newTrip: Trip = {
      id: Date.now().toString(),
      name,
      currency,
      people,
      expenses: [],
      settlements: [],
      createdAt: Date.now()
    };
    onSave(newTrip);
  };

  return (
    <Layout title="Create a Trip" onBack={onCancel}>
      <div className="px-6 py-6 flex flex-col gap-8">
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= s ? 'bg-[#FC8019]' : 'bg-gray-100'}`} 
            />
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#686B78] block mb-2">Trip Name</label>
              <input 
                autoFocus
                type="text"
                placeholder="Ex: Bali Summer '24 🌴"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-2xl font-bold bg-[#F1F1F6] border-none rounded-2xl px-5 py-4 focus:ring-2 ring-[#FC8019] outline-none text-[#282C3F]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#686B78] block mb-2">Currency</label>
              <div className="flex gap-2">
                {['₹', '$', '€', '£'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${currency === c ? 'bg-[#FC8019] border-[#FC8019] text-white' : 'bg-white border-gray-100 text-gray-500'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button 
              disabled={!name}
              onClick={() => setStep(2)}
              className="mt-4 w-full bg-[#FC8019] text-white py-5 rounded-2xl font-extrabold text-lg swiggy-shadow active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#686B78] block mb-2">Invite Friends</label>
              <div className="flex gap-2">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Friend's name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                  className="flex-1 text-lg font-bold bg-[#F1F1F6] border-none rounded-2xl px-5 py-4 focus:ring-2 ring-[#FC8019] outline-none text-[#282C3F]"
                />
                <button onClick={addPerson} className="bg-[#282C3F] text-white px-4 rounded-2xl">
                  <UserPlus size={24} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto no-scrollbar">
              {people.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-50 swiggy-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: p.avatarColor }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-[#282C3F]">{p.name} {p.id === '1' && '(You)'}</span>
                  </div>
                  {p.id !== '1' && (
                    <button onClick={() => removePerson(p.id)} className="text-gray-300">
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-[#F1F1F6] text-[#282C3F] py-4 rounded-2xl font-bold">Back</button>
              <button disabled={people.length < 2} onClick={() => setStep(3)} className="flex-[2] bg-[#FC8019] text-white py-4 rounded-2xl font-extrabold disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8 items-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#60B246]/10 text-[#60B246] rounded-full flex items-center justify-center">
              <Share2 size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#282C3F] mb-2 tracking-tight">Ready to invite?</h2>
              <p className="text-[#686B78] text-sm font-medium px-4">Share this link with your friends so they can join and add expenses in real-time.</p>
            </div>
            
            <div className="w-full bg-white border border-gray-100 p-6 rounded-[32px] swiggy-shadow flex flex-col gap-4">
              <div className="flex items-center justify-between bg-[#F1F1F6] px-4 py-3 rounded-xl border border-dashed border-gray-300">
                <span className="text-xs font-mono text-[#686B78] overflow-hidden truncate">tripsplit.app/join/x7y2z</span>
                <button className="text-[#FC8019] font-bold text-xs uppercase ml-2">Copy</button>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#F1F1F6]">
                  <QrCode size={24} className="text-[#282C3F]" />
                  <span className="text-[10px] font-bold uppercase text-[#686B78]">QR Code</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#F1F1F6]">
                  <Share2 size={24} className="text-[#282C3F]" />
                  <span className="text-[10px] font-bold uppercase text-[#686B78]">Share</span>
                </button>
              </div>
            </div>

            <button onClick={handleFinish} className="w-full bg-[#FC8019] text-white py-5 rounded-2xl font-extrabold text-lg swiggy-shadow">
              Start Trip
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
