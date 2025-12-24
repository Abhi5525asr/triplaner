
export type Category = 'Food' | 'Travel' | 'Stay' | 'Shopping' | 'Fuel' | 'Other';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Wallet';

export interface Person {
  id: string;
  name: string;
  avatarColor: string;
}

export interface PaymentPart {
  personId: string;
  amount: number;
  method: PaymentMethod;
}

export interface SplitMember {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: number;
  category: Category;
  payments: PaymentPart[]; // Multiple people can pay for one expense
  splitWith: SplitMember[]; // Who shares the cost
  addedBy: string;
  note?: string;
}

export interface SettlementRecord {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  date: number;
  method: PaymentMethod;
}

export interface Trip {
  id: string;
  name: string;
  currency: string;
  people: Person[];
  expenses: Expense[];
  settlements: SettlementRecord[];
  createdAt: number;
  startDate?: string;
  endDate?: string;
}

export interface Balance {
  personId: string;
  totalPaid: number;
  totalShare: number;
  totalSettledPaid: number; // Money this person gave to others to settle
  totalSettledReceived: number; // Money this person received from others
  net: number;
}
