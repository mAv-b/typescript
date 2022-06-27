import { Client } from "pg";

async function searchAccountById(connectedDB:Client, query:any):Promise<string>{
    let result = '';
    try{
        const querySearch = {
            text:`SELECT * FROM accounts
                WHERE user_id=$1`,
            values:[query.id]
        };

        const t = await connectedDB.query(querySearch);
        const arr = t.rows.filter(e=>(e.account+e.account_dv === query.account && e.agency+e.agency_dv === query.agency));
        result = arr[0].id;
    }finally{
        return result;
    };
};

export{searchAccountById};