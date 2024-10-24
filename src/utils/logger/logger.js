const { getCurrentDate } = require('../date/date');
const { LogLevels } = require('./log-levels');
const { ConsoleTextFormat, ConsoleTextStyles } = require('./console-format');

// Color map according to log levels
const colorMap = {
  [LogLevels.FATAL]: ConsoleTextStyles.BG_RED,
  [LogLevels.CRITICAL]: [ConsoleTextStyles.FG_BRIGHT_WHITE, ConsoleTextStyles.BG_BRIGHT_RED],
  [LogLevels.ERROR]: ConsoleTextStyles.FG_BRIGHT_RED,
  [LogLevels.WARNING]: ConsoleTextStyles.FG_BRIGHT_YELLOW,
  [LogLevels.INFO]: ConsoleTextStyles.FG_WHITE,
  [LogLevels.STINK]: ConsoleTextStyles.FG_YELLOW,
  [LogLevels.NOTE]: ConsoleTextStyles.FG_WHITE,
  [LogLevels.DEBUG]: ConsoleTextStyles.FG_BRIGHT_MAGENTA,
  [LogLevels.SPAM]: ConsoleTextStyles.FG_BRIGHT_CYAN,
  [LogLevels.FLOOR]: ConsoleTextStyles.FG_WHITE,
  [LogLevels.PHASE]: [ConsoleTextStyles.FG_BLUE, ConsoleTextStyles.BOLD],
  [LogLevels.OK]: ConsoleTextStyles.FG_GREEN,
  [LogLevels.KO]: ConsoleTextStyles.FG_RED,
};

// Basic Logger
const logger = {
  log: (level, message) => {
    const formattedDate = getCurrentDate();
    const colorSeq = colorMap[level] || ConsoleTextStyles.NORMAL; // Default to normal color
    const colorFormat = ConsoleTextFormat(colorSeq);
    const colorEnd = "\x1b[0m";
    console.log(`${colorFormat}${formattedDate} : [${level}] : ${message}${colorEnd}`);
  },
  fatal: (message) => logger.log(LogLevels.FATAL, message),
  critical: (message) => logger.log(LogLevels.CRITICAL, message),
  error: (message) => logger.log(LogLevels.ERROR, message),
  warning: (message) => logger.log(LogLevels.WARNING, message),
  info: (message) => logger.log(LogLevels.INFO, message),
  stink: (message) => logger.log(LogLevels.STINK, message),
  note: (message) => logger.log(LogLevels.NOTE, message),
  debug: (message) => logger.log(LogLevels.DEBUG, message),
  spam: (message) => logger.log(LogLevels.SPAM, message),
  floor: (message) => logger.log(LogLevels.FLOOR, message),
  phase: (message) => logger.log(LogLevels.PHASE, message),
  ok: (message) => logger.log(LogLevels.OK, message),
  ko: (message) => logger.log(LogLevels.KO, message),
};

// Wrapper to enable/disable logs
function createLogger(logEnabled = true) {
  return {
    fatal: (message) => logEnabled && logger.fatal(message),
    critical: (message) => logEnabled && logger.critical(message),
    error: (message) => logEnabled && logger.error(message),
    warning: (message) => logEnabled && logger.warning(message),
    info: (message) => logEnabled && logger.info(message),
    stink: (message) => logEnabled && logger.stink(message),
    note: (message) => logEnabled && logger.note(message),
    debug: (message) => logEnabled && logger.debug(message),
    spam: (message) => logEnabled && logger.spam(message),
    floor: (message) => logEnabled && logger.floor(message),
    phase: (message) => logEnabled && logger.phase(message),
    ok: (message) => logEnabled && logger.ok(message),
    ko: (message) => logEnabled && logger.ko(message),
  };
}

module.exports = { logger, createLogger };