import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';
import MeetingDetails from './components/MeetingDetails';
import {
  getMeetings,
  getItems,
  createMeeting as apiCreateMeeting,
  updateItem as apiUpdateItem,
  deleteItem as apiDeleteItem,
  deleteMeeting as apiDeleteMeeting
} from './services/api';

/**
 * App Component (Central State Orchestrator & Backend Integration)
 * 
 * Phase 3 Architecture:
 * - Data is fetched from and persisted to the Express backend (http://localhost:5000/api).
 * - React state reflects the authoritative state of the backend.
 * - Handles loading, network errors, and asynchronous mutations.
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data from the Express backend
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedMeetings, fetchedItems] = await Promise.all([
        getMeetings(),
        getItems(),
      ]);
      setMeetings(fetchedMeetings);
      setItems(fetchedItems);
    } catch (err) {
      console.error('Failed to connect to API server:', err);
      setError(err.message || 'Could not connect to backend server on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Navigation handlers
  const handleTabChange = (tab) => {
    if (tab !== 'meeting-details') {
      setSelectedMeetingId(null);
    }
    setActiveTab(tab);
  };

  const handleSelectMeeting = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setActiveTab('meeting-details');
  };

  const handleBackToDashboard = () => {
    setSelectedMeetingId(null);
    setActiveTab('dashboard');
  };

  // 1. Create new meeting & extracted items via Backend POST /api/meetings
  const handleCreateMeeting = async (title, notes) => {
    try {
      const result = await apiCreateMeeting(title, notes);
      const newMeeting = result.meeting;
      const newItems = result.items || [];

      setMeetings((prev) => [newMeeting, ...prev]);
      setItems((prev) => [...newItems, ...prev]);

      // Automatically navigate to items tab to review extracted commitments
      setActiveTab('items');
    } catch (err) {
      alert(`Failed to process meeting: ${err.message}`);
      throw err;
    }
  };

  // 2. Toggle status via Backend PATCH /api/items/:id
  const handleToggleStatus = async (itemId) => {
    const currentItem = items.find((i) => i.id === itemId);
    if (!currentItem) return;

    const nextStatusMap = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
    };
    const nextStatus = nextStatusMap[currentItem.status] || 'pending';

    try {
      const updated = await apiUpdateItem(itemId, { status: nextStatus });
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated : item))
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // 3. Update item details via Backend PATCH /api/items/:id
  const handleUpdateItem = async (updatedItem) => {
    try {
      const saved = await apiUpdateItem(updatedItem.id, updatedItem);
      setItems((prev) =>
        prev.map((item) => (item.id === saved.id ? saved : item))
      );
    } catch (err) {
      alert(`Failed to update item: ${err.message}`);
    }
  };

  // 4. Delete item via Backend DELETE /api/items/:id
  const handleDeleteItem = async (itemId) => {
    try {
      await apiDeleteItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  // 5. Delete meeting via Backend DELETE /api/meetings/:id (cascades on backend)
  const handleDeleteMeeting = async (meetingId) => {
    try {
      await apiDeleteMeeting(meetingId);
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
      setItems((prev) => prev.filter((item) => item.meetingId !== meetingId));
    } catch (err) {
      alert(`Failed to delete meeting: ${err.message}`);
    }
  };

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Backend Connection Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <i className="bi bi-exclamation-triangle-fill text-sm shrink-0"></i>
            <div>
              <span className="font-semibold">Backend Connection Issue:</span> {error}
              <span className="block text-[11px] text-zinc-400 mt-0.5">
                Ensure Express server is running on http://localhost:5000.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={loadInitialData}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Initial Loading Indicator */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin"></div>
          <p className="text-xs text-zinc-400 font-mono">Connecting to API server...</p>
        </div>
      ) : (
        /* Main Screens */
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
      )}
    </div>
  );
}

export default App;
