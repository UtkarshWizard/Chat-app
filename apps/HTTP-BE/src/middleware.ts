import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";



export function middleware ( req: Request , res: Response , next: NextFunction ) {
    const token = req.headers["authorization"] ?? ""
    
    const decode = jwt.verify( token , JWT_SECRET )

    if (typeof decode === "string") {
        res.status(403).json({
            message: "Unauthorized"
        });
        
        return;
    }
    
    if (decode) {
        req.userId = decode.userId
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}