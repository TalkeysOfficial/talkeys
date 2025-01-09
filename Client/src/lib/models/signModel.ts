import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
	email: string;
	password: string;
}

const userSchema: Schema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
