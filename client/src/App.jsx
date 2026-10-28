import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';

/**
 * App Component (Root Orchestrator)
 * 
 * Instead of keeping all UI in a single giant file, App acts as the parent:
 * 1. Holds the shared state (activeTab).
 * 2. Passes state and setter functions down to child components via "props".
 * 3. Conditionally renders whichever child screen is active.
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Top Navigation Bar: Receives activeTab and setActiveTab as props */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content: Displays active component based on activeTab */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={setActiveTab} />
        )}

        {activeTab === 'create' && (
          <CreateMeeting />
        )}

        {activeTab === 'items' && (
          <ActionItems />
        )}
      </main>
    </div>
  );
}

export default App;
