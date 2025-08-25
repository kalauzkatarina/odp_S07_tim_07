import type { ResultOfValidation } from "../../../types/validation/ValidationResult";

export function validationOfDatasAuth(username?: string, password?: string): ResultOfValidation {

    if (!username || !password) {
        return { success: false, message: 'Username and password are required' };
    }

    if (username.length < 3) {
        return { success: false, message: 'Username must have at least 3 characters.' };
    }

    if (username.length > 20) {
        return { success: false, message: 'Username can have maximum 20 characters.' };
    }

    if (password.length < 8) {
        return { success: false, message: 'Password must have at least 8 characters.' };
    }

    if (password.length > 20) {
        return { success: false, message: 'Password can have maximum 20 characters.' };
    }

    return { success: true };
}