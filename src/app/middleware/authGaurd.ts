import jwt, {JwtPayload} from "jsonwebtoken";
import {prisma} from "../../db/db";
import {NextFunction, Request, Response} from "express";

import config from "../../config";
import {TJwtPayload} from "../../globalTypes";
import AppError from "../../utils/appError";
import {log} from "console";

const authGaurd = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError(401, "You are not authorized");
            }

            const decodedInfo = jwt.verify(token, config.jwt_secret as string);

            const {email, id, role} = decodedInfo as TJwtPayload;

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email,
                    id: id,
                },
            });

            if (!user) {
                throw new AppError(401, "User not found!");
            }

            if (roles.length && !roles.includes(role)) {
                throw new AppError(401, "You are not authorized");
            }

            req.user = decodedInfo as TJwtPayload;
            next();
        } catch (error) {
            next(error);
        }
    };
};
export default authGaurd;
