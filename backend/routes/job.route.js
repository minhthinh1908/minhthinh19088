import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, getJobWithCompanyLogo, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/getjob").get(getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/getlogo/:id").get( getJobWithCompanyLogo);

export default router;

