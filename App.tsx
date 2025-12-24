
import React, { useState } from 'react';
import { useTripStore } from './store';
import { Home } from './views/Home';
import { CreateTrip } from './views/CreateTrip';
import { TripDashboard } from './views/TripDashboard';
import { Settlement } from './views/Settlement';

enum View {
  Home = 'home',
  CreateTrip = 'create_trip',
  Dashboard = 'dashboard',
  Settlement = 'settlement'
}

const App: React.FC = () => {
  const { trips, addTrip, addExpense, deleteExpense, addSettlement, calculateBalances, getTrip, activeTripId, setActiveTripId } = useTripStore();
  const [currentView, setCurrentView] = useState<View>(View.Home);

  const activeTrip = activeTripId ? getTrip(activeTripId) : null;

  const navigateTo = (view: View, tripId?: string) => {
    if (tripId) setActiveTripId(tripId);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Home:
        return (
          <Home 
            trips={trips} 
            onAddTrip={() => navigateTo(View.CreateTrip)}
            onJoinTrip={() => alert("Scan a QR code or paste a trip link to join! (Simulated)")}
            onTripClick={(id) => navigateTo(View.Dashboard, id)}
            calculateBalances={calculateBalances}
          />
        );
      
      case View.CreateTrip:
        return (
          <CreateTrip 
            onCancel={() => setCurrentView(View.Home)}
            onSave={(trip) => {
              addTrip(trip);
              navigateTo(View.Dashboard, trip.id);
            }}
          />
        );

      case View.Dashboard:
        if (!activeTrip) {
          setCurrentView(View.Home);
          return null;
        }
        return (
          <TripDashboard 
            trip={activeTrip}
            balances={calculateBalances(activeTrip)}
            onBack={() => setCurrentView(View.Home)}
            onAddExpense={(exp) => addExpense(activeTrip.id, exp)}
            onDeleteExpense={(id) => deleteExpense(activeTrip.id, id)}
            onOpenSettlement={() => setCurrentView(View.Settlement)}
          />
        );

      case View.Settlement:
        if (!activeTrip) {
          setCurrentView(View.Home);
          return null;
        }
        return (
          <Settlement 
            trip={activeTrip}
            balances={calculateBalances(activeTrip)}
            onBack={() => setCurrentView(View.Dashboard)}
            onAddSettlement={(s) => addSettlement(activeTrip.id, s)}
          />
        );

      default:
        return <Home trips={[]} onAddTrip={() => {}} onJoinTrip={() => {}} onTripClick={() => {}} calculateBalances={() => []} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F6] flex justify-center items-start pt-0 sm:pt-6 pb-0 sm:pb-6 font-sans antialiased text-[#282C3F]">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[48px] overflow-hidden shadow-2xl relative">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
