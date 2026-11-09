const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Multer configuration for temporary storage (in memory)
const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname).toLowerCase();
		cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
	},
});

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (!allowedImageTypes.has(file.mimetype)) {
			return cb(new Error("Unsupported image type"));
		}

		cb(null, true);
	},
});

// Cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasCloudinaryConfig = () =>
	Boolean(
		process.env.CLOUDINARY_CLOUD_NAME &&
		process.env.CLOUDINARY_API_KEY &&
		process.env.CLOUDINARY_API_SECRET,
	);

const getBaseUrl = (req) =>
	process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

function uploadEventImage(req, res) {
	upload.single("image")(req, res, async (err) => {
		if (err) {
			return res.status(400).json({
				status: "error",
				message: err.message || "Error uploading the file",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				status: "error",
				message: "No file provided",
			});
		}

		try {
			if (hasCloudinaryConfig()) {
				const uploadResult = await cloudinary.uploader.upload(req.file.path, {
					folder: "talkeys/events",
					resource_type: "image",
				});

				fs.unlinkSync(req.file.path);

				return res.status(201).json({
					status: "success",
					url: uploadResult.secure_url,
				});
			}

			if (process.env.NODE_ENV === "production") {
				fs.unlinkSync(req.file.path);
				return res.status(503).json({
					status: "error",
					message: "Cloudinary upload configuration is missing",
				});
			}

			return res.status(201).json({
				status: "success",
				url: `${getBaseUrl(req)}/uploads/${req.file.filename}`,
			});
		} catch (error) {
			console.error(error);
			if (req.file?.path && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path);
			}
			res.status(500).json({
				status: "error",
				message: "Failed to upload image",
			});
		}
	});
}

module.exports = {
	uploadEventImage,
};
