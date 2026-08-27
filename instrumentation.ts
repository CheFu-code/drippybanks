import { createLogger, type LogPayload } from '@chefu-tech/logix-next';

let logger: ReturnType<typeof createLogger> | null = null;

function getLogger() {
    const apiKey = process.env.LOGIX_API_KEY;
    if (!apiKey) return null;

    logger ??= createLogger({
        apiKey,
        endpoint: process.env.LOGIX_ENDPOINT || 'https://api.chefu.co.za',
        batchSize: 1,
        flushInterval: 1000,
    });

    return logger;
}

export function onRequestError(error: unknown, request: { method: string; path: string }) {
    const currentLogger = getLogger();
    if (!currentLogger) return;

    const payload: LogPayload = {
        type: 'error',
        message: error instanceof Error ? error.message : 'Unhandled DrippyBanks request error',
        service: 'drippybanks-web',
        environment: process.env.NODE_ENV || 'production',
        operation: `${request.method} ${request.path}`,
        track: {
            errorName: error instanceof Error ? error.name : 'UnknownError',
            stack: error instanceof Error ? error.stack : undefined,
        },
    };

    currentLogger.log(payload);
}
