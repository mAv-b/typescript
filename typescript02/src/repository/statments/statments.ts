import { Client } from "pg";

async function statments(connectedDB:Client):Promise<any>{
    let result:any = '';
    try{
        const t = await connectedDB.query(`SELECT * FROM transactions`);
        result = t.rows;
    }finally{
        return result;
    };
};

export {statments};