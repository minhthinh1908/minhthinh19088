import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getAllCompanies, getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, singleUpload, registerCompany);
router.route("/get").get(getCompany);
router.route("/getall").get(getAllCompanies);
router.route("/get/:id").get(getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;

