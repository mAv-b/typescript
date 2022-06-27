import {Response, Request} from 'express';
import {connectDB, statments} from '../repository';

async function statmentsController(req:Request, res:Response){
    const selectAllItems = await connectDB('', statments);
    console.log(123);
    res.json(selectAllItems);
};

export {statmentsController};