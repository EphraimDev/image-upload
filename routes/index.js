import app from 'express';
import image from './image';

const router = app.Router();

router.use('/image', image);

export default router;