import { createSignal, createEffect, onMount, For } from "solid-js";
import { getMicrodotblog, type Microdotblog } from "~libs/microblog";
import sanitizeHtml from "sanitize-html";
import DynamicTimestamp from "~components/microblog/dynamic-timestamp";

function Converastion(props: { microdotblog: Microdotblog }) {
   const microdotblog = props.microdotblog;

   return (
      <div class="flex flex-col gap-4 text-slightly-smaller">
         <For each={microdotblog.items}>
            {(reply) => (
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
                        replied <DynamicTimestamp date={reply.date_published} />
                     </span>
                  </div>
                  <div
                     class="reply-content"
                     innerHTML={sanitizeHtml(reply.content_html)}
                  />
               </div>
            )}
         </For>
      </div>
   );
}

export function ReplyArea(props: {
   postUrl: string;
   initialMicrodotblog: Microdotblog;
}) {
   // early return if props aren't delivered
   if (!props.postUrl || !props.initialMicrodotblog) {
      return null;
   }

   const [microdotblog, setMicrodotblog] = createSignal(
      props.initialMicrodotblog,
   );

   const [token, setToken] = createSignal("");
   const [username, setUsername] = createSignal("");
   const [tokenized, setTokenized] = createSignal(false);

   createEffect(() => {
      if (token() && username()) {
         console.log("TOKENIZED");
         setTokenized(true);
      } else {
         console.log("NOT TOKENIZED");
         setTokenized(false);
      }
   });

   const getQueryParam = (param: string) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
   };

   onMount(() => {
      setToken(getQueryParam("token") || "");
      setUsername(getQueryParam("username") || "");

      // remove query params from url
      window.history.replaceState(
         null,
         "",
         window.location.pathname + window.location.hash,
      );
   });

   return (
      <>
         {tokenized() ?
            <>
               <div>TOKEN: {token()}</div>
               <div>USERNAME: {username()}</div>
            </>
         :  null}
         <Converastion microdotblog={microdotblog()} />
      </>
   );
}
