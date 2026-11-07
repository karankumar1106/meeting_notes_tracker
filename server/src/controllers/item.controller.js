import {
  items,
  updateItemById,
  deleteItemById
} from '../data/mockData.js';

/**
 * Controller: Get all action items (with optional query filters)
 * GET /api/items?meetingId=...&status=...
 */
export const getAllItems = (req, res) => {
  const { meetingId, status } = req.query;

  let filtered = [...items];

  if (meetingId) {
    filtered = filtered.filter((i) => i.meetingId === meetingId);
  }

  if (status) {
    filtered = filtered.filter((i) => i.status === status);
  }

  return res.status(200).json(filtered);
};

/**
 * Controller: Partially update an action item
 * PATCH /api/items/:id
 */
export const updateItem = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No update fields provided'
    });
  }

  const updatedItem = updateItemById(id, updates);

  if (!updatedItem) {
    return res.status(404).json({
      success: false,
      message: 'Action item not found'
    });
  }

  return res.status(200).json(updatedItem);
};

/**
 * Controller: Delete an action item
 * DELETE /api/items/:id
 */
export const deleteItem = (req, res) => {
  const { id } = req.params;
  const deleted = deleteItemById(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Action item not found'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Action item deleted successfully'
  });
};

