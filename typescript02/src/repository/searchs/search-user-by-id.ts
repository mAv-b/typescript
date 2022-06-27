import { Client } from "pg";

async function searchById(connectedDB:Client, id:string):Promise<string>{
    let result = '';
    try{
        const searchQuery = {
            text:`SELECT * FROM users
                WHERE id=$1`,
            values:[id]
        };
    
        const t = await connectedDB.query(searchQuery);
        result = t.rows[0].name;
    }finally{
        return result;
    }
};

export {searchById};