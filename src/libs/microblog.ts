export interface Microdotblog {
   home_page_url: string;
   items: [
      {
         id: string;
         content_html: string;
         url: string;
         date_published: string;
         author: {
            name: string;
            url: string;
            _microblog: {
               username: string;
            };
         };
      },
   ];
}

export type MicroblogPhoto = {
   url: string;
   width: number;
   height: number;
};

export type Microblog = {
   id: string;
   date_published: string;
   date_modified?: string;
   categories?: string[];
   photos?: MicroblogPhoto[];
   url: string;
   content_html: string;
   title?: string;
   description?: string;
};

export async function getPosts(feed: string) {
   const res = await fetch(feed);
   if (!res.ok) {
      throw new Error(`Failed to fetch microblog feed: ${res.status}`);
   } else {
      const json = await res.json();
      return json.items;
   }
}

export const getPost = async (id: string, dateParams?: { year: string; month: string; day: string }) => {
   const idDataResponse = await fetch(
      `https://${import.meta.env.MICROBLOG_BASE_URL}/api/ids.json`,
   );

   if (!idDataResponse.ok) {
      throw new Error("Failed to fetch id data");
   } else {
      const idData: {
         ids: { id: string; url: string; date_published: string; date_modified: string }[];
      } = await idDataResponse.json();

      let postUrl: string | undefined = undefined;
      if (
         dateParams &&
         dateParams.year &&
         dateParams.month &&
         dateParams.day &&
         id
      ) {
         for (const item of idData.ids) {
            const postDate = new Date(item.date_published.split("T")[0]);
            if (
               item.id === id &&
               postDate.getUTCFullYear() === parseInt(dateParams.year) &&
               postDate.getUTCMonth() + 1 === parseInt(dateParams.month) &&
               postDate.getUTCDate() === parseInt(dateParams.day)
            ) {
               postUrl = item.url;
               break;
            }
         }
      } else {
         postUrl = idData.ids.find((item) => item.id === id)?.url;
      }

      if (!postUrl) {
         throw new Error(`Failed to find post with id: ${id}`);
      } else {
         let urlParts = new URL(postUrl);
         urlParts.pathname = "/api" + urlParts.pathname;
         const apiUrl = urlParts.toString();

         const res = await fetch(apiUrl);
         if (!res.ok) {
            throw new Error(`Failed to fetch post from ${apiUrl}`);
         } else {
            const json = await res.json();
            return json;
         }
      }
   }
};
