import { Router } from 'express';
import { createQuote, listQuotes, updateQuoteStatus } from '../controllers/quoteController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createQuote);
router.get('/', requireAuth, requireAdmin, listQuotes);
router.patch('/:id', requireAuth, requireAdmin, updateQuoteStatus);

export default router;