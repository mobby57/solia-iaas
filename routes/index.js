import { Router } from "express";
import { addATenantService, loginService } from "../solia/backend/dist/services/tenant.js";

const router = Router();

const addATenantController = async (req, res) => {
  try {
    const result = await addATenantService(null, req.body); // Adjust dbConn as needed
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post("/add", addATenantController);
router.post("/login", loginController);

export default router;
