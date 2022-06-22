import express, {Request, Response, Express} from "express";
import path from 'path';
import dotenv from 'dotenv';
// import express = require('express');

dotenv.config();

const app:Express = express();

app.use(express.static(path.join(__dirname, 'public'))); //sem o join não rola.

app.get('/ping', (req: Request, res: Response)=>{
    res.send('Pong'); 
});

app.listen(process.env.PORT, ()=>{
    console.log('Running');
});
