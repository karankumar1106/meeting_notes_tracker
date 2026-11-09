import { Item } from '../models/item.model.js';

/**
 * Controller: Get all action items (with optional query filters)
 * GET /api/items?meetingId=...&status=...
 */
export const getAllItems = async (req, res) => {
  try {
    const { meetingId, status } = req.query;

    const query = {};
    if (meetingId) {
      query.meetingId = meetingId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch action items' });
  }
};

/**
 * Controller: Partially update an action item
 * PATCH /api/items/:id
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _idField, _id: _mongoId, ...updates } = req.body || {};

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update fields provided',
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Action item not found',
      });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({ success: false, message: 'Failed to update action item' });
  }
};

/**
 * Controller: Delete an action item
 * DELETE /api/items/:id
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Action item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Action item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete action item' });
  }
};

