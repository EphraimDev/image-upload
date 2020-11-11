import app from 'express';
import ImageController from '../controller/image';

const router = app.Router();

router.post('/', ImageController.uploadImage);
router.get('/:file', ImageController.getImage);

export default router;