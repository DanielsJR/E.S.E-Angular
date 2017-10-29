import { Style } from './style';
import { Email } from './email';
export class Author {
    id: number;
    name: string;
    surname: string;
    contact: Email[];
    style: Style[];

}
