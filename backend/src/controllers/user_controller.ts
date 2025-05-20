import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  {users}  from "../models/schema";
import { db } from "../db/db_connect";
import { eq } from 'drizzle-orm';
import AsyncHandler from "../utils/AsyncHandler";
import { APIError } from "../utils/APIError";
import { APIResponse } from '../utils/APIResponse';
import { Request, Response} from 'express';

//generate access token and refresh token
const generateAccessTokenAndRefreshToken = async(userId: string) => {   
    try {
        const userFound = await db.select().from(users).where(eq(users.id , userId));
        const user = userFound[0];
    
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(userId);
    
        return {accessToken , refreshToken};
    } catch (error) {
        throw new APIError(500 , 'Something went wrong while generating accessToken and refreshToken')
    }
}

//generateAccessToken
const generateAccessToken = (user : {id : string , username  :string , email : string}) => {
    return jwt.sign(
        {user} , 
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn:'10m'},
    );
};

//generateRefreshToken
const generateRefreshToken = (userId : string) => {
    return jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn:'15d'}
    )
}

//user login
const UserLogin = AsyncHandler(async(req: Request , res: Response) => {
    const {email , name , password} = req.body;

    if(!email || !password){
        throw new APIError(400 , "email or password is required")
    }

    const user = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .then(res => res[0]);

    if(!user){
        throw new APIError(400 , 'User doesnot exist');
    }

    const isPasswordvalid = await bcrypt.compare(password , user.password);

    if(!isPasswordvalid){
        throw new APIError(400 , 'invalid user Credentials / invalid password');
    }

    const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user.id);

     //save this to db
    await db.update(users).set({accessToken: accessToken}).where(eq(users.id , user.id));

    //but send refresh token via cookie
    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
     secure: false, // use true in production (with HTTPS)
     sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200)
        .json(
            new APIResponse(
                    200,
                    {
                        user: user , accessToken , refreshToken
                    },
                    "User Logged In Successfully"
                )
            )
})

//sign up
const UserSignUp = AsyncHandler(async(req: Request , res: Response) => {
    const {username , email , password} = req.body;

    if(!username || !password || !email){
        throw new APIError(401 , 'username , email , password is required');
    }

    const existingUser = await db.select().from(users).where(eq(users.email , email));

    if(existingUser.length > 0){
        throw new APIError(400 , 'User already exists please login');
    }

    const hashedPassword =await bcrypt.hash(password , 10);

    const [newUser] = await db.insert(users).values({
        email: email,
        username: username,
        password: hashedPassword,
    }).returning();

    const [createdUser] = await db.select().from(users).where(eq(users.username , newUser.username));

    if(!createdUser){
        throw new APIError(500 , 'something went wrong');
    }

    const responsePayload = new APIResponse(201, { userId: createdUser.id }, 'User signed up successfully');

    res.status(201).json(responsePayload);
})

export {
    UserLogin,
    UserSignUp
}