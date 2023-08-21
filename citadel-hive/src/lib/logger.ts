import { createLogger, format, transports } from 'winston';
import * as util from 'util';
import * as path from 'path';

const getLabel = (callingModule: NodeModule) => {
  if (callingModule) {
    // Ack for morgan logger
    if (typeof callingModule === 'string') {
      return callingModule;
    }

    const parts = callingModule.filename.split(path.sep);
    return `${parts[parts.length - 2]}/${parts.pop()}`;
  }

  return undefined;
};

const makeLogger = (callingModule: NodeModule) => {
  const logger = createLogger({
    format: format.combine(
      format.colorize(),
      format.splat(),
      format.timestamp(),
      format.label({ label: getLabel(callingModule) }),
      format.printf(
        (info) =>
          `${info.timestamp} ${info.level}: ${info.label}: ${info.message} ${
            info.meta
              ? util.inspect(info.meta, {
                  showHidden: false,
                  showProxy: false,
                  colors: true,
                })
              : ''
          }`
      )
    ),
    transports: [new transports.Console()],
  });

  (logger as unknown as { stream: { write: (message: string) => void } }).stream = {
    write: (message) => {
      if (!message) {
        return;
      }

      const metaIndex = message.indexOf('@@');
      if (metaIndex >= 0) {
        const meta = JSON.parse(message.substr(metaIndex + 2));
        const newMessage = message.substr(0, metaIndex);
        logger.info(newMessage.trim(), meta);
      } else {
        logger.info(message && message.trim());
      }
    },
  };

  return logger;
};

export default makeLogger;
