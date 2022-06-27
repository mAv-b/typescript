import {BodyOfTransaction, Transfer} from '../models';
import { ValidationTransactionFields } from '../utils';
import { connectDB, transfer } from '../repository';

class TransferService extends ValidationTransactionFields{

    userFields:{
        name:string,
        name_of_destinatary:string,
        cpf:string,
        cpf_of_destinatary:string,
        value:number
    };

    accountFields:{
        agency:string,
        agency_of_destinatary:string,
        account:string,
        account_of_destinatary:string
    };

    userId:string = '';
    destinataryUserId:string = '';
    accountId:string = '';
    destinataryAccountId:string = '';
    error:string = '';
    fee:number = 1;

    constructor(transferBody:BodyOfTransaction){
        super(transferBody);

        const obj = Object(transferBody);
        Object.entries(obj).forEach(
            e => {
                if(e[1] === undefined) obj[e[0]] = '';
            }
        );

        this.userFields = {
            name:obj.name,
            name_of_destinatary:obj.name_of_destinatary,
            cpf:obj.cpf,
            cpf_of_destinatary:obj.cpf_of_destinatary,
            value:obj.value
        };

        this.accountFields = {
            agency:obj.agency,
            agency_of_destinatary:obj.agency_of_destinatary,
            account:obj.account,
            account_of_destinatary:obj.account_of_destinatary
        };

        const {name, name_of_destinatary, cpf, cpf_of_destinatary, value} = this.userFields;
        const {agency, agency_of_destinatary, account, account_of_destinatary} = this.accountFields;

        this.userFieldsIsValid({name, cpf, value})
            .accountFieldsIsValid({agency, account});
        
        this.userFieldsIsValid({name:name_of_destinatary, cpf:cpf_of_destinatary, value})
            .accountFieldsIsValid({agency:agency_of_destinatary, account:account_of_destinatary});

    };

    transferParse():Transfer{
        const t:Transfer = {
            id:this.accountId,
            type:'transfer',
            value:this.userFields.value,
            fee:this.fee,
            destinatary_account:this.accountFields.account_of_destinatary,
            destinatary_id:this.destinataryAccountId,
            timestamp: String(Date.now())
        };
        return t;
    };

    transfer = async (transaction:Transfer):Promise<any> => await connectDB(transaction, transfer);

};

export {TransferService};