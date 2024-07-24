import { createSignal } from "solid-js";
import { getMicrodotblog, type Microdotblog } from "~libs/microblog";

function Converastion(props: { microdotblog: Microdotblog }) {
   const microdotblog = props.microdotblog;

   const MY_USERNAME = import.meta.env.MICROBLOG_USERNAME;

   return microdotblog.items.map((reply) => (
      <div innerHTML={reply.content_html} />
   ));
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
