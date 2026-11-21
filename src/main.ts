import { runBenchmark } from './benchmark.ts';
import { loadConfig } from './config.ts';

async function main(): Promise<void> {
	const { url, timeoutMs } = loadConfig(process.argv.slice(2));
	const result = await runBenchmark(url, timeoutMs);
	
	console.log(`Среднее время запроса: ${result.averageMs.toFixed(2)} мс`);
	console.log(`Общий объём: ${result.totalBytes} байт`);
	console.log(`Скорость скачивания: ${result.speedMBps.toFixed(2)} МБ/с`);
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`Ошибка: ${message}`);
	
	process.exitCode = 1;
});