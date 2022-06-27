import {connectDB, searchUserByCpf, createAccount} from '../repository';
import {Account} from '../models';

class CreateAccount{

    private cpfRegExp = /\d{11}/;
    cpf:string;
    error = ''
    id:string = '';
    constructor(cpf:string){
        this.cpf = cpf;
        this.error = this.cpfIsValid(cpf);
    };

    insertAccount = async (query:Account):Promise<string>=>await connectDB(query, createAccount);

    createAccountData():Account{
        const [agency, agencyCode] = this.createAgencyUser();
        const [accountNumber, accountNumberCode] = this.createAccountNumber();
        const account:Account = {
            user_id: this.id,
            agency: agency,
            agency_dv: agencyCode,
            account: accountNumber,
            account_dv: accountNumberCode,
            balance: 0.0
        };
        return account;
    }

    async userExists(){
        const searchResultId = await connectDB(this.cpf, searchUserByCpf);

        if(!searchResultId){
            return false;
        }else{
            this.id = searchResultId;
            return true;
        }
    };

    private cpfIsValid = (cpf:string)=>{
        if(!this.cpfRegExp.test(cpf))return'Cpf deve ter 11 digitos'

        const validators:string[] = cpf.split('').slice(-2);
        const arr:number[] = cpf.split('').slice(0,-2).map(e=>Number(e));

        let i = 0;
        while(i++ < 2){
            const x = arr.reverse().map((e,i)=>e*(i+2)).reduce((sum, e)=>sum+e, 0);
            arr.reverse().push((x%11 < 2)? 0:11-x%11);
        }

        if(arr.slice(-2).join('') == validators.join(''))return ''
        else return 'Cpf invalido';
    };

    private createAgencyUser():string[]{
        const arr = Array.from({length:4}, () => Math.floor(Math.random()*(10)));
        let dv:any = arr.reduce((sum,e,i)=>sum+e*(5 - i), 0)%11;
        dv = (11-dv < 10)? 11-dv: (11-dv === 10)? 'X':0;

        return [arr.join(''), String(dv)];
    };

    private createAccountNumber():string[]{
        const arr = Array.from({length:8}, ()=>Math.floor(Math.random()*10));
        let dv:any = arr.reduce((sum,e,i)=>sum+e*(9-i), 0)%11;
        dv = (11-dv < 10)? 11-dv: (11-dv === 10)? 'X':0;
        return [arr.join(''), String(dv)];
    }
};

export {CreateAccount};