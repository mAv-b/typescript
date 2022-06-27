import { Client } from "pg";

async function middleware(connectedDB:Client, query:any):Promise<any> {
    let result = '';
    try{

        const queryForSelectAccount = {
            text:`SELECT balance FROM accounts
                WHERE id=$1`,
            values:[query.id]
        };
        const selectAccount = await connectedDB.query(queryForSelectAccount);
        const actualBalance = selectAccount.rows[0].balance;
        
        const newBalance = query.newValue + Number(actualBalance);

        const queryForUpdateAccount = {
            text:`UPDATE accounts SET balance=$1 WHERE id=$2 RETURNING id`,
            values:[newBalance, query.id]
        };

        const updateAccount = await connectedDB.query(queryForUpdateAccount);

        result = updateAccount.rows[0].id

    }finally{
        return result;
    };
};

export{middleware};