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
    const postId = postIdMatch?.[1];

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
                <form onSubmit={handleReply} class="mb-5">
                    <textarea
                        onInput={(e) => {
                            setReplyText(e.currentTarget.value);
                        }}
                        name="text"
                        placeholder="Some nice words..."
                        class="border-figure-outline w-full border p-1.5 outline-hidden"
                    />
                    <div class="flex items-center justify-between">
                        <div>
                            Replying as{" "}
                            <span class="font-medium">
                                <span class="mr-[.03125rem]">@</span>
                                {username()}
                            </span>
                        </div>
                        <button
                            type="submit"
                            class="bg-green inline-flex cursor-pointer items-center justify-center border border-black px-1.5 text-white hover:bg-black"
                        >
                            <span class="relative top-[1px]">Reply</span>
                        </button>
                    </div>
                </form>
            :   null}
            {microdotblog() && microdotblog().items.length > 0 && (
                <div class="py-5">
                    <Conversation {...microdotblog()} />
                </div>
            )}
            {!token() && !username() && (
                <div class="flex flex-col pt-5">
                    <div class="mb-1 font-medium">Reply with:</div>
                    <div>
                        <span class="absolute mr-1.5 block -translate-y-1.5 text-[24px] font-[250]">
                            └
                        </span>
                        <div class="text-slightly-smaller flex gap-1.5">
                            <a
                                href={`https://micro.blog/account/comments/${postId}/mb?url=${props.postUrl}`}
                                class="ml-7 inline-flex w-[72px] items-center justify-center border border-black bg-white px-1.5 shadow-[2px_2px_rgb(187,187,187)] hover:bg-black hover:text-white"
                            >
                                <span class="relative top-[1px]">
                                    Micro.blog
                                </span>
                            </a>
                            <a
                                href={`https://micro.blog/account/comments/${postId}/bluesky?url=${props.postUrl}`}
                                class="inline-flex w-[72px] items-center justify-center border border-black bg-white px-1.5 shadow-[2px_2px_rgb(187,187,187)] hover:bg-black hover:text-white"
                            >
                                <span class="relative top-[1px]">Bluesky</span>
                            </a>
                            <a
                                href={`https://micro.blog/account/comments/${postId}/mastodon?url=${props.postUrl}`}
                                class="inline-flex w-[72px] items-center justify-center border border-black bg-white px-1.5 shadow-[2px_2px_rgb(187,187,187)] hover:bg-black hover:text-white"
                            >
                                <span class="relative top-[1px]">Mastodon</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
