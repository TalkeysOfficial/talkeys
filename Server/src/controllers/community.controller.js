const Community = require("../models/communities.model");
const User = require("../models/users.model");
const { upload, cloudinary } = require("../service/cloudinary");
const fs = require("fs");

exports.getAllCommunities = async (req, res) => {
	try {
		const communities = await Community.find().sort({ createdAt: -1 });
		res.json(communities);
	} catch (err) {
		res.status(500).json({ message: "Error fetching communities" });
	}
};

exports.createCommunity = async (req, res) => {
	upload.single("icon")(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ message: "Image upload error" });
		}

		try {
			const { name, description, slug } = req.body;

			const existing = await Community.findOne({ slug });
			if (existing) {
				return res.status(400).json({ message: "Slug already exists" });
			}

			let iconUrl = "";
			if (req.file) {
				const uploadRes = await cloudinary.uploader.upload(req.file.path, {
					public_id: `community_icon_${Date.now()}`,
				});

				// Delete local file after upload
				fs.unlinkSync(req.file.path);

				iconUrl = cloudinary.url(uploadRes.public_id, {
					fetch_format: "auto",
					quality: "auto",
				});
			}

			const newCommunity = new Community({
				name,
				description,
				slug,
				icon: iconUrl,
				memberCount: 1,
				createdBy: req.user._id, 
				groups: [],
			});

			const saved = await newCommunity.save();

			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { joinedCommunities: saved._id },
			});

			res.status(201).json(saved);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error creating community", error: err });
		}
	});
};

exports.getCommunityBySlug = async (req, res) => {
	try {
		const community = await Community.findOne({ slug: req.params.slug });

		if (!community)
			return res.status(404).json({ message: "Community not found" });

		res.json(community);
	} catch (err) {
		res.status(500).json({ message: "Error fetching community" });
	}
};

exports.joinCommunity = async (req, res) => {
	try {
		const { communityId } = req.params;

		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: { joinedCommunities: communityId },
		});

		await Community.findByIdAndUpdate(communityId, {
			$inc: { memberCount: 1 },
		});

		res.json({ message: "Joined community" });
	} catch (err) {
		res.status(500).json({ message: "Error joining community" });
	}
};

exports.leaveCommunity = async (req, res) => {
	try {
		const { communityId } = req.params;

		await User.findByIdAndUpdate(req.user._id, {
			$pull: { joinedCommunities: communityId },
		});

		await Community.findByIdAndUpdate(communityId, {
			$inc: { memberCount: -1 },
		});

		res.json({ message: "Left community" });
	} catch (err) {
		res.status(500).json({ message: "Error leaving community" });
	}
};

exports.getJoinedCommunities = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("joinedCommunities");

		if (!user) return res.status(404).json({ message: "User not found" });

		res.json(user.joinedCommunities);
	} catch (err) {
		res.status(500).json({ message: "Error fetching joined communities" });
	}
};
