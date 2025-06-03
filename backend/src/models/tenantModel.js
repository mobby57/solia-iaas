import mongoose from "mongoose";
import tenantSchema from "../schema/tenant.js";

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
