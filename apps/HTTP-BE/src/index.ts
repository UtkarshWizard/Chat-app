import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup" , async ( req , res ) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    
    if ( !parsedData.success) {
        res.json({
            message : "Wrong inputs"
        })
    }

    try {
        await prismaClient.user.create({
            data: {
                name: parsedData.data?.name || "Trial", 
                email: parsedData.data?.username || "trial@gmail.com",
                password: parsedData.data?.password || "123456"
            }
        })
        res.json({
            userId: "123"
        })
    } catch(e) {
        res.status(403).json({
            message: "User already exist"
        })
    }

    res.json({
        userId: 123
    })
});

app.post("/signin" , async (req , res) => {

    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.json({
            message: "Wrong inputs"
        })
    }

    const user = await prismaClient.user.findFirst({
       where: {
        email: parsedData.data?.username,
        password: parsedData.data?.password
       }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user.id
    } , JWT_SECRET);

    res.json({
        token
    })

});

app.post("/room", middleware , async (req , res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data?.name || "Test" ,
                adminId: userId
            }
        })
        res.json({
            roomId: room.id
        })
    } catch (e) {
        res.json({
            message: "Room creation failed / Already exist"
        })
    }
    
    
});


app.listen(3001);