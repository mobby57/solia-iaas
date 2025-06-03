import mongoose from "mongoose";
import usersSchema from "../schema/users.js";

const User = mongoose.model("User", usersSchema);

export default User;
