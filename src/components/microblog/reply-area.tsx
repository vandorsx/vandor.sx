export const prerender = false;

import { createSignal } from "solid-js";
import type { Microdotblog } from "~libs/microblog";

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

   const [microdotblog, setMicrodotblog] = createSignal<Microdotblog>(
      props.microdotblog,
   );
   const [token, setToken] = createSignal<string | null>(props.token);
   const [username, setUsername] = createSignal<string | null>(props.username);
}
