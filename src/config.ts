import { loadEnvFile } from 'node:process';

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_TIMEOUT_MS = 2_147_483_647;

type Config = {
	url: URL;
	timeoutMs: number;
};

export const loadConfig = (args: string[]): Config => {
	try {
		loadEnvFile();
	} catch (err) {
		const isMissingFile = err instanceof Error && 'code' in err && err.code === 'ENOENT';
		if (!isMissingFile) throw err;
	}
	
	if (args.length > 1)
		throw new Error('Запуск: npm start -- "<прямой URL файла>"');
	
	const address = args[0] ?? process.env.DOWNLOAD_URL;
	if (!address)
		throw new Error('Передай URL аргументом или задай DOWNLOAD_URL в .env');
	
	const url = new URL(address);
	if (url.protocol !== 'http:' && url.protocol !== 'https:')
		throw new Error('Адрес должен начинаться с http:// или https://');
	
	const timeoutMs = Number(process.env.DOWNLOAD_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
	if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_TIMEOUT_MS)
		throw new Error(`DOWNLOAD_TIMEOUT_MS должен быть целым числом от 1 до ${MAX_TIMEOUT_MS}`);
	
	return { url, timeoutMs };
};
