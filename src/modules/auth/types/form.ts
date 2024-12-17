export enum FormNames {
    email = 'email',
    password = 'password'
}

export type FormTypes = {
    [FormNames.email]: string;
    [FormNames.password]: string;
}

