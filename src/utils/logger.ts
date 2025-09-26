type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const redact = (message: unknown) => {
  if (typeof message === 'string') {
    return message.replace(/("note"\s*:\s*")([\s\S]*?)(")/g, '$1[redacted]$3');
  }
  return message;
};

const log = (level: LogLevel, ...args: unknown[]) => {
  if (__DEV__ || level !== 'debug') {
    console[level](...args.map(redact));
  }
};

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};
