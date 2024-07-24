import { createSignal, createEffect, onMount, For } from "solid-js";
import { getMicrodotblog, type Microdotblog } from "~libs/microblog";
import sanitizeHtml from "sanitize-html";
import DynamicTimestamp from "~components/microblog/dynamic-timestamp";

const [token, setToken] = createSignal("");
const [username, setUsername] = createSignal("");
const [tokenized, setTokenized] = createSignal(false);

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

      const textArea = document.getElementById(
         "reply-field",
      ) as HTMLTextAreaElement;
      const text = textArea.value;
      if (!text) return;

      const body = new URLSearchParams();
      body.append("token", token);
      body.append("username", username);
      body.append("url", postUrl);
      body.append("text", text);

      setToken("");
      setUsername("");

      fetch(`https://micro.blog/account/comments/${props.postId}/post`, {
         method: "POST",
         mode: "no-cors",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         body: body.toString(),
      });
   };

   return (
      <form>
         <textarea
            id="reply-field"
            name="text"
            placeholder="Some nice words..."
            class="w-full border border-black/[.27] p-2 placeholder-black/[.27]"
         ></textarea>
         <button onClick={postReply}>Reply</button>
      </form>
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

   const postIdMatch = props.initialMicrodotblog.home_page_url.match(/(\d+)$/);
   const postId = postIdMatch && postIdMatch[1];

   const [microdotblog, setMicrodotblog] = createSignal(
      props.initialMicrodotblog,
   );

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
            <div class="reply-area-part">
               <ReplyBox
                  token={token()}
                  username={username()}
                  postUrl={props.postUrl}
                  postId={postId || ""}
               />
            </div>
         :  null}
         {microdotblog() && microdotblog().items.length > 0 ?
            <div class="reply-area-part">
               <Converastion microdotblog={microdotblog()} />
            </div>
         :  null}
      </>
   );
}
