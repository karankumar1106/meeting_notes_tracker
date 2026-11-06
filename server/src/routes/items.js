import { Router } from 'express';
import {
  items,
  updateItemById,
  deleteItemById
} from '../data/mockData.js';

const router = Router();

/**
 * GET /api/items
 * Optional query params:
 * - meetingId: filter items by meeting
 * - status: filter items by status ('pending', 'in-progress', 'completed')
 */
router.get('/', (req, res) => {
  const { meetingId, status } = req.query;

  let filtered = [...items];

  if (meetingId) {
    filtered = filtered.filter((i) => i.meetingId === meetingId);
  }

  if (status) {
    filtered = filtered.filter((i) => i.status === status);
  }

  res.status(200).json(filtered);
});

/**
 * PATCH /api/items/:id
 * Partially updates an item's status, text, owner, or dueDate
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  const updatedItem = updateItemById(id, updates);

  if (!updatedItem) {
    return res.status(404).json({ error: 'Action item not found' });
  }

  res.status(200).json(updatedItem);
});

/**
 * DELETE /api/items/:id
 * Deletes an individual action item
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = deleteItemById(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Action item not found' });
  }

  res.status(200).json({ message: 'Action item deleted successfully' });
});

export default router;
