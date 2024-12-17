export enum FormNames {
    name = 'name',
    email = 'email',
    password = 'password'
}

export type FormTypes = {
    [FormNames.name]: string;
    [FormNames.email]: string;
    [FormNames.password]: string;
}

