import { ResultOfValidation } from "../../../Domain/types/ValidationResult";

export function validationOfDatasAuth(username?: string, password?: string): ResultOfValidation {
    
    if(!username || !password){
        return { successful: false, message: 'Username and password are required'};
    }

    if(username.length < 3){
        return { successful: false, message: 'Username must have at least 3 characters.'};
    }

    if(username.length > 20){
        return { successful: false, message: 'Username can have maximum 20 characters.'};
    }

    if(password.length < 8){
    return { successful: false, message: 'Password must have at least 8 characters.' };
    }

    if(password.length > 20){
    return { successful: false, message: 'Password can have maximum 20 characters.' };
    }

    return { successful: true };
}