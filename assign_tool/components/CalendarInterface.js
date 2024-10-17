import { useState } from 'react';

export default function CalendarInterface({ events, onAddEvent, onEditEvent }) {
  const [newEvent, setNewEvent] = useState({ summary: '', start: '', end: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = (e) => {
    e.preventDefault();
    onAddEvent(newEvent);
    setNewEvent({ summary: '', start: '', end: '' });
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    onEditEvent(editingEvent);
    setEditingEvent(null);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="calendar-interface">
      <h2 className="text-2xl font-bold mb-4">Calendar Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
          {events.length === 0 ? (
            <p>No upcoming events</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="border p-2 rounded">
                  <h4 className="font-bold">{event.summary}</h4>
                  <p>Start: {formatDate(event.start.dateTime)}</p>
                  <p>End: {formatDate(event.end.dateTime)}</p>
                  <button 
                    onClick={() => setEditingEvent(event)}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Add New Event</h3>
          <form onSubmit={handleAddEvent} className="space-y-2">
            <input
              type="text"
              placeholder="Event summary"
              value={newEvent.summary}
              onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Add Event</button>
          </form>
        </div>
      </div>

      {editingEvent && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Edit Event</h3>
          <form onSubmit={handleEditEvent} className="space-y-2">
            <input
              type="text"
              value={editingEvent.summary}
              onChange={(e) => setEditingEvent({ ...editingEvent, summary: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={editingEvent.start.dateTime.slice(0, 16)}
              onChange={(e) => setEditingEvent({ ...editingEvent, start: { dateTime: e.target.value } })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={editingEvent.end.dateTime.slice(0, 16)}
              onChange={(e) => setEditingEvent({ ...editingEvent, end: { dateTime: e.target.value } })}
              required
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded">Save Changes</button>
              <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-gray-300 text-black p-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
