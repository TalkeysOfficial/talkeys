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
		cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`);
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

// The client-sent mimetype is not trusted: the stored extension comes from the file's magic bytes.
const detectImageExtension = (filePath) => {
	try {
		const fd = fs.openSync(filePath, "r");
		const bytes = Buffer.alloc(12);
		fs.readSync(fd, bytes, 0, 12, 0);
		fs.closeSync(fd);
		if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return ".jpg";
		if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
		const head = bytes.toString("latin1", 0, 6);
		if (head === "GIF87a" || head === "GIF89a") return ".gif";
		if (bytes.toString("latin1", 0, 4) === "RIFF" && bytes.toString("latin1", 8, 12) === "WEBP") return ".webp";
		return null;
	} catch {
		return null;
	}
};

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

		const ext = detectImageExtension(req.file.path);
		if (!ext) {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({
				status: "error",
				message: "Unsupported image type",
			});
		}
		const finalPath = req.file.path + ext;
		fs.renameSync(req.file.path, finalPath);
		req.file.path = finalPath;
		req.file.filename += ext;

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
