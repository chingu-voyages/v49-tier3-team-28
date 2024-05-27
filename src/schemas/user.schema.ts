import { User } from "@/models/user.model";
import mongoose, { Schema } from "mongoose";

/* UserSchema will correspond to the User collection in the MongoDB database. */
const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace from both ends
      lowercase: true, // Converts the email to lowercase
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Regex to validate email format
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Ensures the password is at least 6 characters long
    },
    
  },
  { timestamps: true }
);

export const UserRepository: mongoose.Model<User> =
  mongoose.models.User || mongoose.model("User", userSchema);
