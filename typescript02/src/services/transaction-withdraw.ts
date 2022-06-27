import { BodyOfTransaction, Withdraw } from "../models";
import { ValidationTransactionFields } from "../utils";
import {connectDB, withdraw} from '../repository';


class WithdrawService extends ValidationTransactionFields{

    userFields:{
        name:string, cpf:string, value:number
    };
    accountFields:{
        agency:string, account:string
    };

    userId:string = '';
    accountId:string = '';
    fee:number = 4;
    error:string = '';

    constructor(withdrawBody:BodyOfTransaction){

        super(withdrawBody);

        this.userFields = {
            name:withdrawBody.name,
            cpf:withdrawBody.cpf,
            value:withdrawBody.value
        };

        this.accountFields = {
            agency:withdrawBody.agency,
            account:withdrawBody.account
        };

        this.userFieldsIsValid(this.userFields)
            .accountFieldsIsValid(this.accountFields);
    };

    withdraw = async (transaction:Withdraw):Promise<any> => await connectDB(transaction, withdraw);

    parseWithdraw():Withdraw{
        const t:Withdraw = {
            id:this.accountId,
            type:'withdraw',
            value: Number(this.userFields.value),
            fee: this.fee,
            timestamp:String(Date.now())
        };
        return t;
    };
};

export {WithdrawService};