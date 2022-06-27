import { Account } from "../../models";
import { Client } from "pg";

async function createAccount(connectedDB:Client, query:Account):Promise<string>{
    let result = '';
    try{
        const accountQuery = {
            text:`INSERT INTO accounts
            (user_id, agency, agency_dv, account, account_dv, balance)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id`,
            values:[
                query.user_id,
                query.agency,
                query.agency_dv,
                query.account,
                query.account_dv,
                query.balance
            ]
        };
        const t = await connectedDB.query(accountQuery);
        console.log(t);
        result = t.rows[0].user_id;
    }finally{
        return result;
    };
};

export {createAccount};