import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
