interface Deposit{
    id:string,
    type:string,
    value:number,
    fee:number,
    timestamp:string,
};

interface Withdraw{
    id:string,
    type:string,
    value:number,
    fee:number,
    timestamp:string
};

interface Transfer{
    id:string,
    type:string,
    value:number,
    fee:number,
    destinatary_account:string,
    destinatary_id:string,
    timestamp:string
}

interface BodyOfTransaction{
    name:string,
    name_of_destinatary?:string,
    cpf:string,
    cpf_of_destinatary?:string,
    agency:string,
    agency_of_destinarary:undefined|string,
    account:string,
    account_of_destinarary?:string
    value:number
}

export {Deposit, BodyOfTransaction, Withdraw, Transfer};