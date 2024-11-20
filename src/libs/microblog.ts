export interface MicrodotblogReply {
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
}

export interface Microdotblog {
   home_page_url: string;
   items: MicrodotblogReply[];
}

export type MicroblogPhoto = {
   url: string;
   width: number;
   height: number;
};

export type PaginatedMicroblog = {
   page: number;
   pages: number;
   total_items: number;
   items_per_page: number;
   next_page: string | null;
   previous_page: string | null;
   items: Microblog[];
};

export type Microblog = {
   id: string;
   date_published: string;
   date_modified?: string;
   categories?: string[];
   photos?: MicroblogPhoto[];
   url: string;
   content_html: string;
   titled_post: boolean;
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

export async function getArchive(page: number) {
   let res: Response;

   if (page <= 1) {
      res = await fetch(
         `https://${import.meta.env.MICROBLOG_BASE_URL}/api/archive/list.json`,
      );
   } else {
      res = await fetch(
         `https://${import.meta.env.MICROBLOG_BASE_URL}/api/archive/${page}/list.json`,
      );
   }

   if (!res.ok) {
      throw new Error(`Failed to fetch microblog archive: ${res.status}`);
   } else {
      const json = await res.json();
      return json;
   }
}

export const getPost = async (
   id: string,
   dateParams?: { year: string; month: string; day: string },
) => {
   const idDataResponse = await fetch(
      `https://${import.meta.env.MICROBLOG_BASE_URL}/api/ids.json`,
   );

   if (!idDataResponse.ok) {
      throw new Error("Failed to fetch id data");
   } else {
      const idData: {
         ids: {
            id: string;
            url: string;
            date_published: string;
            date_modified: string;
         }[];
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

export const getMicrodotblog = async (permalink: string) => {
   const getConversationUrl = (url: string) =>
      `https://micro.blog/conversation.js?url=${url}&format=jsonfeed&nocache=${new Date().getTime()}`;

   let res: Response = await fetch(getConversationUrl(permalink));

   // If 404, try with the former hostname
   if (res.status === 404) {
      try {
         const permalinkWithFormerHostname = permalink.replace(
            /^https?:\/\/([^\/]+)/,
            "https://jade.micro.blog",
         );
         const fallbackRes = await fetch(
            getConversationUrl(permalinkWithFormerHostname),
         );

         if (fallbackRes.ok) {
            return await fallbackRes.json();
         }
      } catch (error) {
         console.error("Error in second attempt:", error);
      }
   }

   if (res.ok) {
      return await res.json();
   }

   console.error(res);
};
