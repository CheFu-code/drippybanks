import { createLogger, type LogLevel, type LogPayload } from '@chefu-tech/logix-next';

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

export function logix(payload: LogPayload) {
    getLogger()?.log({
        ...payload,
        service: payload.service || 'drippybanks-web',
        environment: payload.environment || process.env.NODE_ENV || 'production',
    });
}

export function track(level: LogLevel, message: string, metadata: Omit<LogPayload, 'type' | 'message'> = {}) {
    logix({ ...metadata, message, type: level });
}

export const logixInfo = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('info', message, metadata);
export const logixWarning = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('warning', message, metadata);
export const logixError = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('error', message, metadata);
export const logixDebug = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('debug', message, metadata);
export const logixAudit = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('audit', message, metadata);
export const logixMetric = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('metric', message, metadata);
export const logixSuccess = (message: string, metadata?: Omit<LogPayload, 'type' | 'message'>) => track('success', message, metadata);
