import express from "express";
import {
    getfavorites,
    getUserBookings,
    updateFavorite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.get('/favorites', getfavorites);         // ✅ To fetch favorites
userRouter.post('/update-favorite', updateFavorite); // ✅ To toggle favorite


export default userRouter;
