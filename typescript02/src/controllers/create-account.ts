import {Request, Response} from 'express';
import { CreateAccount } from '../services';


async function createAccount(req:Request, res:Response){
    const user = new CreateAccount(req.body.cpf);

    if(user.error){
        return res.status(400).json({
            status:400,
            error:user.error
        });
    };

    const existUser = await user.userExists();
    if(!existUser){
        return res.status(400).json({
            status:400,
            error:'Not exist a user with this cpf.'
        });
    };
    console.log(existUser);
    const accountForUser = await user.insertAccount(user.createAccountData());
    if(accountForUser){
        return res.status(201).json({
            status:201,
            id:accountForUser
        });
    }else{
        return res.status(500).json({
            status:500,
            error:'unexpected error occurred'
        })
    }

};

export{createAccount};