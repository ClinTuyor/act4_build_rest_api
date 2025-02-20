import express, { Request, Response } from "express";
import { UnitUser } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./user.database";

export const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {
    try {
        const allUsers: UnitUser[] = await database.findAll();

        if (allUsers.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No users at this time...' });
        }

        return res.status(StatusCodes.OK).json({ total_users: allUsers.length, users: allUsers });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
});

userRouter.get("/users/:id", async (req: Request, res: Response, next: Function) => {
    try {
        const user : UnitUser = await database.findOne(req.params.id);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found!' });
        }

        return res.status(StatusCodes.OK).json({ user });
    } catch (error) {
        return next (error);
    } 
})