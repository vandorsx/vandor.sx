import { createSignal, For } from "solid-js";
import { getMicrodotblog, type Microdotblog } from "~libs/microblog";
import sanitizeHtml from "sanitize-html";
import DynamicTimestamp from "~components/microblog/dynamic-timestamp";

function Converastion(props: { microdotblog: Microdotblog }) {
   const microdotblog = props.microdotblog;

   const MY_USERNAME = import.meta.env.MICROBLOG_USERNAME;

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
                     {reply.author._microblog.username === MY_USERNAME && (
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
   if (!props.postUrl || !props.initialMicrodotblog) {
      return null;
   }

   const [microdotblog, setMicrodotblog] = createSignal(
      props.initialMicrodotblog,
   );

   return <Converastion microdotblog={microdotblog()} />;
}
