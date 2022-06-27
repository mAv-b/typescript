import {Client} from 'pg';
import { Withdraw } from '../../models';
import {middleware} from '..';


async function withdraw(connectedDB:Client, query:Withdraw):Promise<any>{
    let result = '';
    try{

        const queryForUpdateAccount = {
            id: query.id,
            newValue: (query.value+query.fee)*(-1)
        };
        const updateAccount = await middleware(connectedDB, queryForUpdateAccount);

        if(updateAccount){
            const insertTransaction = {
                text:`INSERT INTO transactions
                    (account_id, type, value, fee, timestamp)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                values:[query.id, query.type, query.value, query.fee, query.timestamp]
            };
            const t = await connectedDB.query(insertTransaction);
            result = t.rows[0];
        };

    }finally{
        return result;
    }
};

export {withdraw};