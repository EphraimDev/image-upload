import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import sharp from 'sharp';
import fs from 'fs';

dotenv.config();
class ImageController {
	static async uploadImage(req, res) {
		try {
			const time = new Date().getTime();
			const storage = multer.diskStorage({
				destination: (_req, file, cb) => {
					cb(null, './images/full');
				},
				filename: (_req, file, cb) => {
					cb(null, time + file.fieldname + path.extname(file.originalname));
				},
			});

			const upload = multer({
				storage: storage,
				fileFilter: ImageController.validateImage,
			});

			const imageUpload = await upload.single('picture');
			imageUpload(req, res, async function(err) {
				if (req.file) {
					sharp(req.file.path)
						.resize(200, 200)
						.toFile(
							'images/thumbnails/' + req.file.filename,
							(err, _resizeImage) => {
								if (err) {
									return res
										.status(400)
										.json({ error: 'failed to save thumnail' });
								}
							}
						);
					return res.status(200).json({
						image_url: process.env.URL + '/full/' + req.file.filename,
						thumnail: process.env.URL + '/thumbnails/' + req.file.filename,
					});
				} else {
					return res.status(400).json({
						err: 'failed',
					});
				}
			});
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	static validateImage(req, file, cb) {
		const ext = path.extname(file.originalname);
		const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
		if (!extensions.includes(ext)) {
			return cb(new Error('Only images are allowed'));
		}

		cb(null, true);
	}

	static async getImage(req, res) {
		const { file } = req.params;
		fs.stat('images/full/' + file, function(err, _stat) {
			if (err == null) {
				return res.status(200).json({
					image_url: process.env.URL + '/full/' + file,
					thumnail: process.env.URL + '/thumbnails/' + file,
				});
			} else {
				return res.status(400).json({
					err: 'file does not exist',
				});
			}
		});
	}
}

export default ImageController;
