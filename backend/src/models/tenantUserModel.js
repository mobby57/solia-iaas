import mongoose from "mongoose";
import tenantUserSchema from "../schema/tenantUser.js";

const TenantUser = mongoose.model("TenantUser", tenantUserSchema);

export default TenantUser;
