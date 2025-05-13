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
        <div>
            {token() && username() ?
                <form onSubmit={handleReply}>
                    <textarea
                        onInput={(e) => {
                            setReplyText(e.currentTarget.value);
                        }}
                        name="text"
                        placeholder="Some nice words..."
                    />
                    <div class="flex items-center justify-between">
                        <div>
                            Replying as{" "}
                            <span>
                                <span class="mr-[.03125rem]">@</span>
                                {username()}
                            </span>
                        </div>
                        <button type="submit" class="cursor-pointer]">
                            <span>Reply</span>
                        </button>
                    </div>
                </form>
            :   null}
            {microdotblog() && microdotblog().items.length > 0 && (
                <div>
                    <Conversation {...microdotblog()} />
                </div>
            )}
            {!token() && !username() && (
                <div class="pt-5">
                    <div class="mb-1 font-medium">Reply with:</div>
                    <div class="flex gap-1.5">
                        <span class="absolute -translate-y-1.5 text-[24px] font-[250]">
                            └
                        </span>
                        <a
                            href={`https://micro.blog/account/comments/${postId}/mb?url=${props.postUrl}`}
                            class="ml-7 inline-flex w-20 items-center justify-center border border-black bg-[#ff8800] px-1.5 text-white hover:bg-black"
                        >
                            <span class="relative top-[1px]">Micro.blog</span>
                        </a>
                        <a
                            href={`https://micro.blog/account/comments/${postId}/bluesky?url=${props.postUrl}`}
                            class="inline-flex w-20 items-center justify-center border border-black bg-[#0a7aff] px-1.5 text-white hover:bg-black"
                        >
                            <span class="relative top-[1px]">Bluesky</span>
                        </a>
                        <a
                            href={`https://micro.blog/account/comments/${postId}/mastodon?url=${props.postUrl}`}
                            class="inline-flex w-20 items-center justify-center border border-black bg-[#563ACC] px-1.5 text-white hover:bg-black"
                        >
                            <span class="relative top-[1px]">Mastodon</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
