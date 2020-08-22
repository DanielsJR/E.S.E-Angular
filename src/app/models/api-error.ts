export class ApiError {
    constructor(
        public exception?: string,
        public message?: any,
        public errors?: string[],
        public status?: any,
        public path?: string,
    ) { }
}