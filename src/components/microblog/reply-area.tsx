import { createSignal, createEffect, onMount, For, onCleanup } from "solid-js";
import {
   getMicrodotblog,
   type Microdotblog,
   type MicrodotblogReply,
} from "~libs/microblog";
import sanitizeHtml from "sanitize-html";
import { formatTimeRelatively } from "~libs/relative-time";
import { set } from "astro/zod";

const [microdotblog, setMicrodotblog] = createSignal<Microdotblog | null>(null);
const [token, setToken] = createSignal<string | undefined>(undefined);
const [username, setUsername] = createSignal<string | undefined>(undefined);

const refreshConversation = async (postUrl: string) => {
   let retries = 0;
   let updatedMicrodotblog: Microdotblog | null = null;

   try {
      while (retries < 5) {
         if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 250));
         }

         updatedMicrodotblog = await getMicrodotblog(postUrl);

         if (
            updatedMicrodotblog &&
            (!microdotblog() ||
               JSON.stringify(updatedMicrodotblog) !==
                  JSON.stringify(microdotblog()))
         ) {
            break;
         }

         retries++;
      }

      if (updatedMicrodotblog) {
         setMicrodotblog(updatedMicrodotblog);
      }
   } catch (error) {
      console.error("Error fetching conversation:", error);
   }
};

function Reply(props: { reply: MicrodotblogReply }) {
   const reply = props.reply;

   const [relativeTimestamp, setRelativeTimestamp] = createSignal(
      formatTimeRelatively(reply.date_published),
   );

   const interval = setInterval(
      () => setRelativeTimestamp(formatTimeRelatively(reply.date_published)),
      1000,
   );
   onCleanup(() => clearInterval(interval));

   return (
      <div class="flex flex-col">
         <div class="reply-metadata font-serif italic">
            {reply.author.url ?
               <a href={reply.author.url} target="_blank">
                  {reply.author.name}
               </a>
            :  <span>{reply.author.name}</span>}
            {reply.author._microblog.username ===
               import.meta.env.MICROBLOG_USERNAME && (
               <span class="text-black/[.54]"> (me)</span>
            )}
            <span class="text-black/[.72]">
               {" "}
               replied <span>{relativeTimestamp()}</span>
            </span>
         </div>
         <div
            class="reply-content"
            innerHTML={sanitizeHtml(reply.content_html)}
         />
      </div>
   );
}

function ReplyBox(props: {
   token: string;
   username: string;
   postUrl: string;
   postId: string;
}) {
   const token = props.token;
   const username = props.username;
   const postUrl = props.postUrl;

   const postReply = (event: MouseEvent) => {
      event.preventDefault();

      if (!token || !username || !postUrl) return;

      const text = (
         document.getElementById("reply-field") as HTMLTextAreaElement
      ).value;
      if (!text) return;

      const body = new URLSearchParams();
      body.append("token", token);
      body.append("username", username);
      body.append("url", postUrl);
      body.append("text", text);

      setToken(undefined);
      setUsername(undefined);

      fetch(`https://micro.blog/account/comments/${props.postId}/post`, {
         method: "POST",
         mode: "no-cors",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         body: body.toString(),
      });

      refreshConversation(postUrl);
   };

   return (
      <form class="mb-5 text-slightly-smaller">
         <textarea
            id="reply-field"
            name="text"
            placeholder="Some nice words..."
            class="w-full border border-black/[.27] p-2 placeholder-black/[.27] outline-none"
         ></textarea>
         <div class="flex items-center justify-between">
            <div class="font-serif text-xs italic text-black/[.54]">
               Replying as{" "}
               <span class="font-[327]">
                  <span class="mr-[.03125rem]">@</span>
                  {username}
               </span>
            </div>
            <button
               onClick={postReply}
               class="border border-black/[.27] px-2.5 font-serif italic hover:border-black/[.54] hover:bg-black/[.027]"
            >
               Reply
            </button>
         </div>
      </form>
   );
}

export function ReplyArea(props: {
   postUrl: string;
   initialMicrodotblog: Microdotblog;
   token?: string;
   username?: string;
}) {
   setToken(props.token);
   setUsername(props.username);

   // early return if props aren't delivered
   if (!props.postUrl || !props.initialMicrodotblog) {
      return null;
   }

   const postIdMatch = props.initialMicrodotblog.home_page_url.match(/(\d+)$/);
   const postId = postIdMatch && postIdMatch[1];

   if (!microdotblog()) {
      setMicrodotblog(props.initialMicrodotblog);
   }

   return (
      <>
         {token() && username() ?
            <div class="reply-area-part">
               <ReplyBox
                  token={token() as string}
                  username={username() as string}
                  postUrl={props.postUrl}
                  postId={postId || ""}
               />
            </div>
         :  null}
         {(
            microdotblog() && microdotblog()!.items.length > 0 // remove the two !s eventually!!
         ) ?
            <div class="reply-area-part">
               <div class="flex flex-col gap-4 text-slightly-smaller">
                  <For each={microdotblog()!.items}>
                     {(reply) => <Reply reply={reply} />}
                  </For>
               </div>
            </div>
         :  null}

         {(!token() || !username()) && (
            <div
               id="reply-buttons"
               class="pt-3 text-right font-serif text-xs italic text-black/[.54]"
            >
               reply with{" "}
               <a
                  href={`https://micro.blog/account/comments/${postId}/mb?url=${props.postUrl}`}
               >
                  micro.blog
               </a>
               ,{" "}
               <a
                  href={`https://micro.blog/account/comments/${postId}/bluesky?url=${props.postUrl}`}
               >
                  bluesky
               </a>
               , or{" "}
               <a
                  href={`https://micro.blog/account/comments/${postId}/mastodon?url=${props.postUrl}`}
               >
                  mastodon
               </a>
            </div>
         )}
      </>
   );
}
