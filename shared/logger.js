/**
 * Общий класс логгера (заглушка).
 * Далее расширим: расчёт путей по минутам, формат JSON-строки и запись в файл.
 */
export default class Logger {
  constructor(baseDir = 'logs') {
    this.baseDir = baseDir;
  }
  // В следующих шагах добавим: getCurrentMinuteDir(), format(), append()
}
