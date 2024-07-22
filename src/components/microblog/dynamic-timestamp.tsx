import { createSignal, onCleanup } from "solid-js";
import { formatTimeRelatively } from "~libs/relative-time";

interface Props {
   date: string;
}

export default function DynamicTimestamp(props: Props) {
   const [relativeTimestamp, setRelativeTimestamp] = createSignal(formatTimeRelatively(props.date, true));
	const interval = setInterval(
		() => setRelativeTimestamp(formatTimeRelatively(props.date, true)),
		1000
	);
	onCleanup(() => clearInterval(interval));
   
	return relativeTimestamp;
}