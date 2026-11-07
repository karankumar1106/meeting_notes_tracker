import { Router } from 'express';
import {
  getAllItems,
  updateItem,
  deleteItem
} from '../controllers/item.controller.js';

const router = Router();

// Route: /api/items
router.route('/')
  .get(getAllItems);

// Route: /api/items/:id
router.route('/:id')
  .patch(updateItem)
  .delete(deleteItem);

export default router;

