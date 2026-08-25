import { Router } from 'express';
import { getSummary, listCustomers } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, requireAdmin, getSummary);
router.get('/customers', requireAuth, requireAdmin, listCustomers);

export default router;