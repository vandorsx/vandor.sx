import { MICROBLOG_API_TOKEN } from "astro:env/server";

export type Book = {
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
};

export type Bookshelf = {
   id: number;
   title: string;
   content_text?: string;
   url: string;
   date_published: string;
   _microblog: {
      type: string;
      books_count: number;
   };
};

export async function getBooks(bookshelf_id: number) {
   const res = await fetch(
      `https://micro.blog/books/bookshelves/${bookshelf_id}`,
      {
         headers: {
            Authorization: `Bearer ${MICROBLOG_API_TOKEN}`,
         },
      },
   );
   if (!res.ok) {
      throw new Error(`Failed to fetch bookshelf: ${res.status}`);
   } else {
      const json = await res.json();
      return json.items;
   }
}

export async function getBookshelves() {
   const res = await fetch(`https://micro.blog/books/bookshelves`, {
      headers: {
         Authorization: `Bearer ${MICROBLOG_API_TOKEN}`,
      },
   });
   if (!res.ok) {
      throw new Error(`Failed to fetch bookshelves: ${res.status}`);
   } else {
      const json = await res.json();
      return json.items;
   }
}
