import { Router } from 'express';
import {
  listServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listServices);
router.get('/:slug', getServiceBySlug);
router.post('/', requireAuth, requireAdmin, createService);
router.patch('/:id', requireAuth, requireAdmin, updateService);
router.delete('/:id', requireAuth, requireAdmin, deleteService);

export default router;