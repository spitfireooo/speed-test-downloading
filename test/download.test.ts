import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/config.ts';
import { download } from '../src/download.ts';

test('скачивает файл по адресу DOWNLOAD_URL', async () => {
	const { url, timeoutMs } = loadConfig([]);
	const { bytes, elapsedMs } = await download(url, timeoutMs);

	assert.ok(bytes > 0, 'Тело ответа должно содержать данные');
	assert.ok(Number.isFinite(elapsedMs) && elapsedMs > 0, 'Время скачивания должно быть положительным');
});
