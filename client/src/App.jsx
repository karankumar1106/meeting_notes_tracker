import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';
import { INITIAL_MEETINGS, INITIAL_ITEMS, simulateAIExtraction } from './data/mockData';

/**
 * App Component (Central State Orchestrator)
 * 
 * "Lifting State Up" & Persistence:
 * 1. Holds meetings and items state.
 * 2. Initializes state from browser localStorage so data survives page refreshes.
 * 3. Uses useEffect to synchronize state changes back to localStorage automatically.
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Lazy state initialization: reads localStorage once on startup
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('meeting_tracker_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('meeting_tracker_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  // useEffect: Runs whenever 'meetings' state changes to keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('meeting_tracker_meetings', JSON.stringify(meetings));
  }, [meetings]);

  // useEffect: Runs whenever 'items' state changes to keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('meeting_tracker_items', JSON.stringify(items));
  }, [items]);

  // 1. Handler: Add new meeting and its extracted items
  const handleCreateMeeting = (title, notes) => {
    const { newMeeting, newItems } = simulateAIExtraction(title, notes);

    setMeetings((prevMeetings) => [newMeeting, ...prevMeetings]);
    setItems((prevItems) => [...newItems, ...prevItems]);

    // Automatically navigate to Action Items view so user sees the result!
    setActiveTab('items');
  };

  // 2. Handler: Toggle item status (pending -> in-progress -> completed -> pending)
  const handleToggleStatus = (itemId) => {
    const nextStatusMap = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending',
    };

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, status: nextStatusMap[item.status] || 'pending' }
          : item
      )
    );
  };

  // 3. Handler: Delete an item
  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Screens */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard
            meetings={meetings}
            items={items}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'create' && (
          <CreateMeeting onCreateMeeting={handleCreateMeeting} />
        )}

        {activeTab === 'items' && (
          <ActionItems
            items={items}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteItem}
          />
        )}
      </main>
    </div>
  );
}

export default App;
