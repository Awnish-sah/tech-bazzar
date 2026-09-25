import express from 'express';
import {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  toggleHeroBannerActive
} from '../controllers/heroBannerController.js';

const router = express.Router();

router.get('/', getHeroBanners);
router.post('/', createHeroBanner);
router.put('/:id', updateHeroBanner);
router.delete('/:id', deleteHeroBanner);
router.patch('/:id/active', toggleHeroBannerActive);

export default router;
