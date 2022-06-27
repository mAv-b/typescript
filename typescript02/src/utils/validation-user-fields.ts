import {User, Error} from '../models';

class ValidationUserFields{
    
    private nameRegExp = /^[a-z\s]{5,}$/i;
    private emailRegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    private cpfRegExp = /\d{11}/;
    private birthdayYearsMinimum = 16;

    error:Error;
    fields: User;

    constructor(userFields:User){
        this.fields = userFields;
        this.error = '';
    };

    
    validateFields(){
        const fields = this.fields;
        
        const arr = [
            this.validateName(fields.name),
            this.validateEmail(fields.email),
            this.validateCpf(fields.cpf),
            this.validateBirthday(fields.birthday),
        ];
        this.error = arr.filter(e=>e!=='').reduce((str,e)=>(str=='')? e:str+', '+e,'');

        return Boolean(this.error);
    };
    
    private validateName = (name:string)=>{
        if(this.nameRegExp.test(name))return '';
        return (name.length >= 5)? 'Nome não aceita digitos e caracteres especiais':'Nome tem que ter no minimo 5 letras';
    };

    private validateEmail = (email:string)=>{
        return this.emailRegExp.test(email)? '':'Email invalido';
    };

    private validateBirthday = (birthday:string)=>{
        const bool = this.birthdayYearsMinimum <= (new Date().getFullYear() - new Date(birthday).getFullYear());
        return bool? '':'Você deve ter no minimo 16 anos';
    };

    private validateCpf = (cpf:string)=>{
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

};

export {ValidationUserFields};



// private validationDictionary:ReadonlyMap<string, any> = new Map<string, any>([
    //     ['name', /^[a-z]+$/g],
    //     ['birthday', 16],
    //     ['email', /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/],
    //     ['cpf', /^\d{11}$/],
    // ]);