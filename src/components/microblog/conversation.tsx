import type { Microdotblog, MicrodotblogReply } from "~libs/microblog";
import { createSignal, onCleanup, For } from "solid-js";
import { formatTimeRelatively } from "~libs/relative-time";
import sanitizeHtml from "sanitize-html";

const MY_USERNAME = "jade";

function Reply(reply: MicrodotblogReply) {
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
            <div>
                {reply.author.url ?
                    <a href={reply.author.url} target="_blank">
                        {reply.author.name}
                    </a>
                :   <span>{reply.author.name}</span>}
                {reply.author._microblog.username === MY_USERNAME && (
                    <span> (me)</span>
                )}
                <span>
                    {" "}
                    replied <span>{relativeTimestamp()}</span>
                </span>
            </div>
            <div innerHTML={sanitizeHtml(reply.content_html)} />
        </div>
    );
}

export default function Conversation(microdotblog: Microdotblog) {
    return (
        <div class="flex flex-col gap-4">
            <For each={microdotblog.items}>
                {(reply) => <Reply {...reply} />}
            </For>
        </div>
    );
}
