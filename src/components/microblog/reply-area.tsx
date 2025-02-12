export const prerender = false;

import { createSignal } from "solid-js";
import type { Microdotblog } from "~libs/microblog";
import { getMicrodotblog } from "~libs/microblog";
import Conversation from "~components/microblog/conversation";

interface ReplyAreaProps {
   postUrl: string;
   microdotblog: Microdotblog;
   token: string | null;
   username: string | null;
}

export default function ReplyArea(props: ReplyAreaProps) {
   if (!props.postUrl || !props.microdotblog) {
      return null;
   }

   const postIdMatch = props.microdotblog.home_page_url.match(/(\d+)$/);
   const postId = postIdMatch && postIdMatch[1];

   const [microdotblog, setMicrodotblog] = createSignal<Microdotblog>(
      props.microdotblog,
   );
   const [token, setToken] = createSignal<string | null>(props.token);
   const [username, setUsername] = createSignal<string | null>(props.username);

   async function refreshConverastion() {
      let retries = 0;
      let updatedMicrodotblog: Microdotblog | null = null;

      try {
         while (retries < 5) {
            if (retries > 0) {
               await new Promise((resolve) => setTimeout(resolve, 250));
            }

            updatedMicrodotblog = await getMicrodotblog(props.postUrl);

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
   }

   const [replyText, setReplyText] = createSignal<string>("");
   function handleReply(e: Event) {
      e.preventDefault();

      const currentToken = token();
      const currentUsername = username();
      if (!currentToken || !currentUsername) return;
      if (replyText().trim() === "") return;

      const body = new URLSearchParams();
      body.append("token", currentToken);
      body.append("username", currentUsername);
      body.append("url", props.postUrl);
      body.append("text", replyText());

      setToken(null);
      setUsername(null);

      fetch(`https://micro.blog/account/comments/${postId}/post`, {
         method: "POST",
         mode: "no-cors",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         body: body.toString(),
      });

      refreshConverastion();
   }

   return (
      <div id="reply-area">
         {token() && username() ?
            <form
               class="text-slightly-smaller mb-5"
               onSubmit={handleReply}
               id="reply-area-form"
            >
               <textarea
                  onInput={(e) => {
                     setReplyText(e.currentTarget.value);
                  }}
                  id="reply-field"
                  name="text"
                  placeholder="Some nice words..."
                  class="w-full border border-black/[.27] p-2 placeholder-black/[.27] outline-hidden"
               />
               <div class="flex items-center justify-between">
                  <div class="font-serif text-xs text-black/[.54] italic">
                     Replying as{" "}
                     <span class="font-[327]">
                        <span class="mr-[.03125rem]">@</span>
                        {username()}
                     </span>
                  </div>
                  <button
                     type="submit"
                     class="cursor-pointer border border-black/[.27] px-2.5 font-serif italic hover:border-black/[.54] hover:bg-black/[.027]"
                  >
                     Reply
                  </button>
               </div>
            </form>
         :  null}
         {microdotblog() && microdotblog().items.length > 0 && (
            <div class="mb-3" id="reply-area-conversation">
               <Conversation {...microdotblog()} />
            </div>
         )}
         {!token() && !username() && (
            <div
               id="reply-area-buttons"
               class="pt-3 text-right font-serif text-xs text-black/[.54] italic"
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
      </div>
   );
}
