import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';
import MeetingDetails from './components/MeetingDetails';
import { INITIAL_MEETINGS, INITIAL_ITEMS, simulateAIExtraction } from './data/mockData';

/**
 * App Component (Central State Orchestrator)
 * 
 * "Lifting State Up" & Persistence:
 * 1. Holds meetings, items, and selectedMeetingId state.
 * 2. Initializes state from browser localStorage so data survives page refreshes.
 * 3. Uses useEffect to synchronize state changes back to localStorage automatically.
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

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

  // 1. Navigation Handler: Switch tabs and clear selected meeting if switching away
  const handleTabChange = (tab) => {
    if (tab !== 'meeting-details') {
      setSelectedMeetingId(null);
    }
    setActiveTab(tab);
  };

  // 2. Handler: Select a specific meeting to view its details
  const handleSelectMeeting = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setActiveTab('meeting-details');
  };

  // 3. Handler: Return from MeetingDetails back to Dashboard
  const handleBackToDashboard = () => {
    setSelectedMeetingId(null);
    setActiveTab('dashboard');
  };

  // 4. Handler: Add new meeting and its extracted items
  const handleCreateMeeting = (title, notes) => {
    const { newMeeting, newItems } = simulateAIExtraction(title, notes);

    setMeetings((prevMeetings) => [newMeeting, ...prevMeetings]);
    setItems((prevItems) => [...newItems, ...prevItems]);

    // Automatically navigate to Action Items view so user sees the result!
    setActiveTab('items');
  };

  // 5. Handler: Toggle item status (pending -> in-progress -> completed -> pending)
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

  // 6. Handler: Delete an item
  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // 7. Handler: Update an item's details (text, owner, dueDate, etc.)
  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  // 8. Handler: Delete a meeting AND cascade-delete its action items
  const handleDeleteMeeting = (meetingId) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    setItems((prev) => prev.filter((item) => item.meetingId !== meetingId));
  };

  // Find the selected meeting object
  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Screens */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard
            meetings={meetings}
            items={items}
            onNavigate={handleTabChange}
            onSelectMeeting={handleSelectMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}

        {activeTab === 'create' && (
          <CreateMeeting onCreateMeeting={handleCreateMeeting} />
        )}

        {activeTab === 'items' && (
          <ActionItems
            items={items}
            onToggleStatus={handleToggleStatus}
            onUpdateItem={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        )}

        {activeTab === 'meeting-details' && (
          <MeetingDetails
            meeting={selectedMeeting}
            items={items}
            onBack={handleBackToDashboard}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </main>
    </div>
  );
}

export default App;
