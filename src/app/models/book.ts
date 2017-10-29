import { Theme } from './theme';
import { Author } from './author';
export class Book {
    id: number;
    isbn: string;
    title: string;
    authorList?: Author[];
    themeList?: Theme[];

}
