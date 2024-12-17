import { createHmac } from 'crypto';


export function hashString(password: string): string {
    const secret = 'abcdefg';
    const hash = createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    console.log(hash);

    return hash
}
