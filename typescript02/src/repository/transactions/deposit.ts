import {Client} from 'pg';
import {Deposit} from '../../models';
import {middleware} from '..';

async function deposit(connectedDB:Client, query:Deposit):Promise<any>{
    let result:any = '';
    try{

        const queryForUpdateAccount = {
            id: query.id,
            newValue: query.value-query.fee
        }
        const updateAccount = await middleware(connectedDB, queryForUpdateAccount)

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
    };
};

export {deposit};