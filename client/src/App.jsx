import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';
import { INITIAL_MEETINGS, INITIAL_ITEMS, simulateAIExtraction } from './data/mockData';

/**
 * App Component (Central State Orchestrator)
 * 
 * "Lifting State Up":
 * By keeping `meetings` and `items` here in the parent component,
 * CreateMeeting can add new items, Dashboard can count them,
 * and ActionItems can display, filter, and edit them!
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [items, setItems] = useState(INITIAL_ITEMS);

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
