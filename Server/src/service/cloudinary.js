const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");

// Multer configuration for temporary storage (in memory)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.resolve(__dirname, "../../uploads");
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getUrl = (req, res) => {
	upload.single("image")(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ error: "Error uploading the file" });
		}

		if (!req.file) {
			return res.status(400).json({ error: "No file provided" });
		}

		try {
			const uploadResult = await cloudinary.uploader.upload(req.file.path, {
				public_id: `uploaded_image_${Date.now()}`,
			});

			fs.unlinkSync(req.file.path);

			const optimizedUrl = cloudinary.url(uploadResult.public_id, {
				fetch_format: "auto",
				quality: "auto",
			});

			res.status(200).json({ url: optimizedUrl });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Failed to upload image to Cloudinary" });
		}
	});
};

module.exports = { upload, getUrl };
