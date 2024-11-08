export type Bookshelf = {
   id: number;
   title: string;
   content_text?: string;
   url: string;
   image: string;
   date_published: string;
   authors: {
      name: string;
   }[];
   _microblog: {
      isbn: string;
   };
}[];

export type Library = {
   id: number;
   title: string;
   content_text?: string;
   url: string;
   date_published: string;
   _microblog: {
      type: string;
      books_count: number;
   };
}[];
