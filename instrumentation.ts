import { logixError } from './lib/logix';

export function onRequestError(error: unknown, request: { method: string; path: string }) {
    logixError(
        error instanceof Error ? error.message : 'Unhandled DrippyBanks request error',
        {
            operation: `${request.method} ${request.path}`,
            track: {
                errorName: error instanceof Error ? error.name : 'UnknownError',
                stack: error instanceof Error ? error.stack : undefined,
            },
        },
    );
}
