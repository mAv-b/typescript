interface User {
    name:string,
    birthday:string,
    email:string,
    cpf:string,
}

interface NewUser {
    id:string,
    name:string,
    email:string,
    cpf:string,
    birthday:string,
    timestamp:string
}

export {User, NewUser}