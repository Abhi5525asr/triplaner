
import React from 'react';
import { Utensils, Plane, Hotel, ShoppingBag, Fuel, MoreHorizontal, Wallet, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Category } from './types';

export const COLORS = {
  primary: '#FC8019', // Swiggy Orange
  bg: '#FFFFFF',
  surface: '#F1F1F6',
  text: '#282C3F',
  subtext: '#686B78',
  success: '#60B246',
  error: '#EC3838'
};

export const CATEGORIES: { label: Category; icon: React.ReactNode; color: string }[] = [
  { label: 'Food', icon: <Utensils size={20} />, color: '#EF4444' },
  { label: 'Travel', icon: <Plane size={20} />, color: '#3B82F6' },
  { label: 'Stay', icon: <Hotel size={20} />, color: '#8B5CF6' },
  { label: 'Shopping', icon: <ShoppingBag size={20} />, color: '#EC4899' },
  { label: 'Fuel', icon: <Fuel size={20} />, color: '#F59E0B' },
  { label: 'Other', icon: <MoreHorizontal size={20} />, color: '#6B7280' },
];

export const PAYMENT_TYPES = [
  { label: 'Cash', icon: <Banknote size={18} /> },
  { label: 'UPI', icon: <Smartphone size={18} /> },
  { label: 'Card', icon: <CreditCard size={18} /> },
  { label: 'Wallet', icon: <Wallet size={18} /> },
];

export const AVATAR_COLORS = [
  '#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#94A3B8'
];
