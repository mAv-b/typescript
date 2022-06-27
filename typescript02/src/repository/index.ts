import {Client, ClientConfig} from 'pg';
import {NewUser} from '../models';
import dotenv from 'dotenv';

dotenv.config();
const config:ClientConfig = {
    user:process.env.USER,
    host:process.env.HOST,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:Number(process.env.DB_PORT)
};

async function connectDB(query:any, callback:(client:Client, param:any)=>any):Promise<any>{
    const client = new Client(config);
    try{
        await client.connect();
        return await callback(client, query);
    }finally{
        await client.end();
    };
};

export {connectDB};
export {statments} from './statments/statments';
export {createUser} from './users-accounts/create-user';
export {searchUserByCpf} from './searchs/search-user-by-cpf';
export {createAccount} from './users-accounts/create-account';
export {searchById} from './searchs/search-user-by-id';
export {searchAccountById} from './searchs/search-account';
export {deposit} from './transactions/deposit';
export {withdraw} from './transactions/withdraw';
export {transfer} from './transactions/transfer';
export {middleware} from './users-accounts/updateAccount';