import {Request, Response} from 'express';
import { ParseUserData } from '../services';
import {connectDB, createUser} from '../repository';

const createUserController = async function(req:Request, res:Response){
    const parserData = new ParseUserData(req.body);
    if(parserData.validateFields()){
        return res.status(400).json({
            status:400,
            error:parserData.error
        });
    }

    const parsedData = parserData.parse();
    const result = await connectDB(parsedData, createUser);
    if(result.length > 0){
        return res.status(201).json({
            status:201,
            id:result
        });
    }else{
        return res.status(500).json({
            status:500,
            error:'unexpected error occurred.'
        })
    }
};

export{createUserController};