import {BodyOfTransaction, Deposit} from '../models';
import {ValidationTransactionFields} from '../utils';
import {connectDB, deposit} from '../repository';

class DepositService extends ValidationTransactionFields{

    userFields:{name:string, cpf:string, value:number};
    accountFields:{agency:string, account:string};
    userId:string = '';
    accountId:string = '';
    fee:number = 1/100

    constructor(depositBody:BodyOfTransaction){
        super(depositBody);
        this.userFields = {name:depositBody.name, cpf:depositBody.cpf, value:depositBody.value};
        this.accountFields= {agency:depositBody.agency, account:depositBody.account};

        this.userFieldsIsValid(this.userFields)
            .accountFieldsIsValid(this.accountFields);
    };

    parseDeposit():Deposit{
        const t:Deposit = {
            id:this.accountId,
            type:'deposit',
            value: Number(this.userFields.value),
            fee: Number(this.userFields.value)*this.fee,
            timestamp:String(Date.now())
        };
        return t;
    };

    deposit = async (transaction:Deposit):Promise<any> => await connectDB(transaction, deposit);
    
};

export{DepositService};