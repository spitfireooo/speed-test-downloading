import { get as httpGet, type IncomingMessage } from 'node:http';
import { get as httpsGet } from 'node:https';
import { performance } from 'node:perf_hooks';

type DownloadResult = {
	bytes: number;
	elapsedMs: number;
};

export async function download(url: URL, timeoutMs: number): Promise<DownloadResult> {
	const get = url.protocol === 'https:' ? httpsGet : httpGet;
	const signal = AbortSignal.timeout(timeoutMs);
	const startedAt = performance.now();
	
	const response = await new Promise<IncomingMessage>((resolve, reject) => {
		const request = get(
			url,
			{ signal, headers: { 'Accept-Encoding': 'identity' } },
			resolve,
		);
		
		request.once('error', reject);
	});
	
	const status = response.statusCode;
	if (status === undefined || status < 200 || status >= 300) {
		response.destroy();
		throw new Error(`Неуспешный HTTP-ответ (${status ?? 'статус отсутствует'})`);
	}
	
	
	// Загрузка чанками
	let bytes = 0;
	for await (const chunk of response) {
		bytes += chunk.length;
	}
	
	if (!response.complete)
		throw new Error('Ответ получен не полностью');
	
	return { bytes, elapsedMs: performance.now() - startedAt };
}