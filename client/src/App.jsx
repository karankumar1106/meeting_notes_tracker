import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import ActionItems from './components/ActionItems';
import MeetingDetails from './components/MeetingDetails';
import AuthModal from './components/AuthModal';
import {
  getMeetings,
  getItems,
  createMeeting as apiCreateMeeting,
  updateItem as apiUpdateItem,
  deleteItem as apiDeleteItem,
  deleteMeeting as apiDeleteMeeting,
  getCurrentUserApi,
  logoutApi,
} from './services/api';

/**
 * App Component (Central State Orchestrator & Authentication Integration)
 * 
 * Phase 6 Architecture:
 * - Session verification on mount via getCurrentUserApi().
 * - Protected screens: displays AuthModal for unauthenticated visitors.
 * - Multi-tenancy: each authenticated user views and manages only their own records.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load records belonging to the authenticated user
  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedMeetings, fetchedItems] = await Promise.all([
        getMeetings(),
        getItems(),
      ]);
      setMeetings(fetchedMeetings || []);
      setItems(fetchedItems || []);
    } catch (err) {
      console.error('Failed to load user records:', err);
      setError(err.message || 'Could not connect to backend server on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify authentication on startup
  useEffect(() => {
    const verifyAuth = async () => {
      setIsAuthLoading(true);
      try {
        const res = await getCurrentUserApi();
        if (res.user) {
          setCurrentUser(res.user);
          await loadUserData();
        }
      } catch (err) {
        // Not logged in or expired token
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    await loadUserData();
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
      setMeetings([]);
      setItems([]);
      setSelectedMeetingId(null);
      setActiveTab('dashboard');
    }
  };

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

  // 1. Create new meeting via Backend POST /api/meetings
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

  // Initial Auth Verification Loading Spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin"></div>
        <p className="text-xs text-zinc-400 font-mono">Verifying authentication...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => {}}
      />

      {/* Backend Connection Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <i className="bi bi-exclamation-triangle-fill text-sm shrink-0"></i>
            <div>
              <span className="font-semibold">Connection Issue:</span> {error}
            </div>
          </div>
          <button
            type="button"
            onClick={loadUserData}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Unauthenticated View: Render Auth Screen */}
      {!currentUser ? (
        <AuthModal onAuthSuccess={handleAuthSuccess} />
      ) : isLoading ? (
        /* Authenticated Loading Indicator */
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin"></div>
          <p className="text-xs text-zinc-400 font-mono">Loading your meeting records...</p>
        </div>
      ) : (
        /* Authenticated Main Screens */
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
