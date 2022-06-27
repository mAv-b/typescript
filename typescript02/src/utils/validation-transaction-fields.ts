import {BodyOfTransaction} from '../models';
import {connectDB, searchUserByCpf, searchById, searchAccountById} from '../repository';

class ValidationTransactionFields{

    private cpfRegExp = /\d{11}/;
    private nameRegExp = /^[a-z\s]{5,}$/i;

    error:string = '';
    constructor(depositBody:BodyOfTransaction){
        
    };

    parseName = (name:string):string=>{
        const words = name.split(' ');
        return words.reduce((sum,e)=> {
            const firstLetter = e.charAt(0).toUpperCase();
            const residue = e.slice(1).toLowerCase();
            return sum + firstLetter+residue+' '
        }, '').trim();
    };

    async existUser(cpf:string, name:string){
        const searchByCpf = await connectDB(cpf, searchUserByCpf);
        
        if(!searchByCpf){
            return '';
        };
        const searchNameWithId = await connectDB(searchByCpf, searchById);
        
        if(name.toLowerCase() !== searchNameWithId.toLowerCase())return '';
        return searchByCpf;
    };

    async existAccount(id:string, account:string, agency:string){
        const t = {
            id:id,
            account:account,
            agency:agency
        };
        
        const search = await connectDB(t, searchAccountById);
        if(!search)return '';

        return search;
    };

    userFieldsIsValid(fields:{name:string|undefined, cpf:string|undefined, value:number}){

        const {name, cpf, value} = fields;
        const arr = [this.nameIsValid(name), this.cpfIsValid(cpf), this.valueIsValid(value)];

        this.error += arr.filter(e=>e!=='').reduce((str,e)=>(str=='')? e:str+', '+e,'');
        return this;
    };

    accountFieldsIsValid(fields:{agency:string|undefined,account:string|undefined}){

        const {agency, account} = fields;
        const arr = [this.agencyIsValid(agency), this.accountIsValid(account)];

        this.error += arr.filter(e=>e!=='').reduce((str,e)=>(str=='')? e:str+', '+e,'');
        return this;
    };

    cpfIsValid = (cpf:string|undefined)=>{
        if(!cpf)return 'Cpf vazio';

        if(!this.cpfRegExp.test(cpf))return'Cpf deve ter 11 digitos';

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

    nameIsValid = (name:string|undefined)=>{
        if(!name)return 'Nome vazio';

        if(!this.nameRegExp.test(name)){
            return (name.length < 5)? 'Nome deve ter no minimo 5 caracteres':'Nome não deve conter digitos e caracteres especiais'
        }else return '';
    };

    agencyIsValid = (agency:string|undefined)=>{
        if(!agency)return 'Agencia vazio';

        const dv = agency.split('').slice(-1);
        const arr = agency.split('').slice(0,-1);

        let code:any;
        const sum = arr.map((e,i)=>Number(e)*(5-i)).reduce((sum,e)=>sum+e, 0);
        if(11-sum%11 <= 10){
            code = (11-sum%11 === 10)? 'X':11-(sum%11);
        }else code = 0;

        if(dv.join('') === String(code))return ''
        else return 'Numero de agencia invalido';
    };

    accountIsValid = (account:string|undefined)=>{
        if(!account)return 'Conta vazio';

        const dv = account.split('').slice(-1);
        const arr = account.split('').slice(0,-1);

        let code:any;
        const sum = arr.map((e,i)=>Number(e)*(9-i)).reduce((sum,e)=>sum+e, 0);
        if(11-sum%11 <= 10){
            code = (11-sum%11 === 10)? 'X':11-sum%11;
        }else code = 0;

        if(dv.join('') === String(code))return ''
        else return 'Numero da conta invalido';
    };

    valueIsValid = (value:number)=>{
        if(!value)return 'valor não especificado';
        else if(Number(value) < 0)return 'valor invalido';
        return '';
    };
};

export {ValidationTransactionFields};