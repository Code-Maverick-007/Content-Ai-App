import express from "express";
import { auth } from "../middlewares/auth.js";
import { 
    getUserCreations, 
    getPublishedCreations, 
    toggleLikeCreations,
    getDashboardData 
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations);
userRouter.get('/get-published-creations', getPublishedCreations);
userRouter.post('/toggle-like-creations', auth, toggleLikeCreations);
userRouter.get('/dashboard-data', auth, getDashboardData);

export default userRouter;