import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
	const [debounceValue, setDebounceValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebounceValue(value), delay);
		return () => clearTimeout(handler);
	}, [delay, value]);

	return debounceValue;
}

export default useDebounce;
