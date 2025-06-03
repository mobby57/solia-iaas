import express from "express";
import mongoose from "mongoose";
import { addATenantUserRepo, getATenantUserRepo, updateATenantUserRepo } from "../../../../repositories/tenantUser.js";

const router = express.Router();
const dbConn = mongoose.connection;

// Create a new tenant user
router.post("/", async (req, res) => {
  try {
    const tenantUser = await addATenantUserRepo(dbConn, req.body);
    res.status(201).json(tenantUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tenant users
router.get("/", async (req, res) => {
  try {
    // Since the repository has getATenantUserRepo for findOne, for find all we use model directly
    const tenantUsers = await dbConn.model("tenantusers").find().populate("tenantId").lean();
    res.json(tenantUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tenant user by id
router.get("/:id", async (req, res) => {
  try {
    const tenantUser = await getATenantUserRepo(dbConn, { _id: req.params.id });
    if (!tenantUser) return res.status(404).json({ error: "Tenant user not found" });
    res.json(tenantUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant user by id
router.put("/:id", async (req, res) => {
  try {
    const updateResult = await updateATenantUserRepo(dbConn, { _id: req.params.id }, req.body);
    if (updateResult.modifiedCount === 0) return res.status(404).json({ error: "Tenant user not found" });
    const updatedTenantUser = await getATenantUserRepo(dbConn, { _id: req.params.id });
    res.json(updatedTenantUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete tenant user by id
router.delete("/:id", async (req, res) => {
  try {
    const deleteResult = await dbConn.model("tenantusers").deleteOne({ _id: req.params.id });
    if (deleteResult.deletedCount === 0) return res.status(404).json({ error: "Tenant user not found" });
    res.json({ message: "Tenant user deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
