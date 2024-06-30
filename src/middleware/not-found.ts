import { Request, Response } from "express";

export default function notFoundMiddleware(req: Request, res: Response){
    res.status(404).json({message: "We can't find the data that you want."})
}