import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// Multer configuration for temporary storage (in memory)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Temporarily store the file in the "uploads" folder
		const uploadPath = path.resolve(__dirname, "../../uploads");
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		// Use the original file name as the filename
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handle image upload route
export const config = {
	api: {
		bodyParser: false, // Disable the default body parser for handling form-data (needed for multer)
	},
};

export default function getUrl (req, res) {
	// Use multer to handle the file upload
	upload.single("image")(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ error: "Error uploading the file" });
		}

		// Make sure the file is uploaded
		if (!req.file) {
			return res.status(400).json({ error: "No file provided" });
		}

		try {
			// Upload to Cloudinary
			const uploadResult = await cloudinary.uploader.upload(req.file.path, {
				public_id: `uploaded_image_${Date.now()}`, // Unique public_id for the image
			});

			// Remove the temporary file from the server
			fs.unlinkSync(req.file.path);

			// Return the optimized image URL
			const optimizedUrl = cloudinary.url(uploadResult.public_id, {
				fetch_format: "auto",
				quality: "auto",
			});

			return optimizedUrl;
		} catch (error) {
			console.error(error);
			res.status(500).json({
				error: "Failed to upload image to Cloudinary",
			});
		}
	});
};
