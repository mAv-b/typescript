import {Request, Response} from 'express';
import {DepositService, WithdrawService, TransferService} from '../services';


async function deposit(req:Request, res:Response){
    const transaction = new DepositService(req.body);

    if(transaction.error){
        return res.status(400).json({
            status:400,
            error:transaction.error
        });
    };

    transaction.userId = await transaction.existUser(transaction.userFields.cpf, transaction.userFields.name);
    if(!transaction.userId){
        return res.status(404).json({
            status:404,
            error:'Cliente não existe'
        });
    }

    transaction.accountId = await transaction.existAccount(transaction.userId, transaction.accountFields.account, transaction.accountFields.agency);
    if(!transaction.accountId){
        return res.status(404).json({
            status:404,
            error:'Conta não existe'
        });
    };

    const parsedData = transaction.parseDeposit();
    const insertTransaction = await transaction.deposit(parsedData);

    if(insertTransaction.id){
        res.status(200).json({
            status:200,
            body:insertTransaction
        });
    }else{
        res.status(500).json({
            status:500,
            error:'unexpected error occurred.'
        });
    };
};

async function withdraw(req:Request, res:Response){
    const transaction = new WithdrawService(req.body);
    if(transaction.error){
        res.status(400).json({
            status:400,
            error:transaction.error
        });
    };

    transaction.userId = await transaction.existUser(transaction.userFields.cpf, transaction.userFields.name);
    if(!transaction.userId){
        return res.status(404).json({
            status:404,
            error:'Cliente não encontrado'
        });
    }

    transaction.accountId= await transaction.existAccount(transaction.userId, transaction.accountFields.account, transaction.accountFields.agency);
    if(!transaction.accountId){
        return res.status(404).json({
            status:404,
            error:'Conta não encontrada'
        });
    };


    const transactionParsed = transaction.parseWithdraw();
    console.log(transactionParsed);
    const insertTransaction = await transaction.withdraw(transactionParsed);

    if(insertTransaction.id){
        return res.status(200).json({
            status:200,
            body:insertTransaction
        });
    }else{
        return res.status(500).json({
            status:500,
            body:'unexpected error occurred'
        });
    };
};

async function transfer(req:Request, res:Response){
    const transaction = new TransferService(req.body);
    if(transaction.error){
        return res.status(400).json({
            status:400,
            error:transaction.error
        });
    };

    transaction.userId = await transaction.existUser(transaction.userFields.cpf, transaction.userFields.name);
    transaction.destinataryUserId = await transaction.existUser(transaction.userFields.cpf_of_destinatary, transaction.userFields.name_of_destinatary);

    if(!transaction.userId || !transaction.destinataryUserId){
        res.status(404).json({
            status:404,
            error:'Um dos clientes não existe'
        });
    };

    transaction.accountId = await transaction.existAccount(transaction.userId, transaction.accountFields.account, transaction.accountFields.agency);
    transaction.destinataryAccountId = await transaction.existAccount(transaction.destinataryUserId, transaction.accountFields.account_of_destinatary, transaction.accountFields.agency_of_destinatary);

    if(!transaction.accountId || !transaction.destinataryAccountId){
        res.status(404).json({
            status:404,
            error:'Uma das contas não existe'
        });
    };

    const parsedData = transaction.transferParse();
    console.log(parsedData);
    const insertTransaction = await transaction.transfer(parsedData);
    if(insertTransaction.id){
        return res.status(200).json({
            status:200,
            body: insertTransaction
        });
    }else{
        return res.status(500).json({
            status:500,
            body:'unexpected error occurred.'
        });
    }
};

export{deposit, withdraw, transfer};