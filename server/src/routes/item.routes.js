import { Router } from 'express';
import {
  getAllItems,
  updateItem,
  deleteItem,
} from '../controllers/item.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all action item routes with JWT authentication
router.use(verifyJWT);

// Route: /api/items
router.route('/')
  .get(getAllItems);

// Route: /api/items/:id
router.route('/:id')
  .patch(updateItem)
  .delete(deleteItem);

export default router;
