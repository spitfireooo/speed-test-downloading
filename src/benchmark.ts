import { download } from './download.ts';

const REQUEST_COUNT = 10;

export async function runBenchmark(url: URL, timeoutMs: number) {
	let totalBytes = 0;
	let totalMs = 0;
	
	for (let attempt = 1; attempt <= REQUEST_COUNT; attempt++) {
		try {
			const { bytes, elapsedMs } = await download(url, timeoutMs);
			totalBytes += bytes;
			totalMs += elapsedMs;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Запрос ${attempt} из ${REQUEST_COUNT}: ${message}`, {
				cause: error,
			});
		}
	}
	
	return {
		totalBytes,
		averageMs: totalMs / REQUEST_COUNT,
		speedMBps: (totalBytes / 1_000_000) / (totalMs / 1_000),
	};
}
