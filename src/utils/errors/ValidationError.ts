import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
    errors: any[];

    constructor(errors: any[], code: number, message: string) {
        super(code, message);

        this.errors = errors;
    }
}
