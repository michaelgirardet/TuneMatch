export const logger = {
  info: (message: string, data?: object) => console.log(message, data || ''),
  error: (message: string, data?: object) => console.error(message, data || ''),
  warn: (message: string, data?: object) => console.warn(message, data || ''),
  debug: (message: string, data?: object) => console.debug(message, data || ''),
}; 