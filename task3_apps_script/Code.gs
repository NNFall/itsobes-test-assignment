const API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';
const RATES_SHEET_NAME = 'Rates';
const STATUS_CELL = 'I2';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Курсы ЦБ')
    .addItem('Обновить курсы', 'refreshCbrRates')
    .addItem('Создать ежедневный триггер', 'createDailyRatesTrigger')
    .addToUi();
}

function refreshCbrRates() {
  const sheet = getOrCreateSheet_(RATES_SHEET_NAME);

  try {
    writeStatus_(sheet, 'Обновление запущено...');

    const response = UrlFetchApp.fetch(API_URL, {
      method: 'get',
      muteHttpExceptions: true,
    });

    const statusCode = response.getResponseCode();
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`API вернул HTTP ${statusCode}`);
    }

    const payload = JSON.parse(response.getContentText());
    if (!payload || typeof payload.Valute !== 'object') {
      throw new Error('В ответе API отсутствует объект Valute');
    }

    const rows = buildRows_(payload);
    writeRatesTable_(sheet, rows, payload);
    writeStatus_(sheet, `OK: обновлено ${new Date().toLocaleString('ru-RU')}`);
  } catch (error) {
    writeStatus_(sheet, `Ошибка: ${error.message}`);
  }
}

function createDailyRatesTrigger() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'refreshCbrRates') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('refreshCbrRates')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  const sheet = getOrCreateSheet_(RATES_SHEET_NAME);
  writeStatus_(sheet, 'Ежедневный триггер создан: примерно 09:00');
}

function buildRows_(payload) {
  return Object.keys(payload.Valute)
    .map((code) => {
      const item = payload.Valute[code];
      const nominal = Number(item.Nominal);
      const value = Number(item.Value);
      const previous = Number(item.Previous);

      if (!nominal || Number.isNaN(value) || Number.isNaN(previous)) {
        throw new Error(`Некорректные числовые поля валюты ${code}`);
      }

      const rubPerUnit = value / nominal;
      const previousRubPerUnit = previous / nominal;
      const changeAbs = rubPerUnit - previousRubPerUnit;
      const changePercent =
        previousRubPerUnit === 0 ? 0 : (changeAbs / previousRubPerUnit) * 100;

      return [
        code,
        item.Name,
        nominal,
        round_(rubPerUnit, 4),
        round_(previousRubPerUnit, 4),
        round_(changeAbs, 4),
        round_(changePercent, 3),
      ];
    })
    .sort((left, right) => Math.abs(right[6]) - Math.abs(left[6]));
}

function writeRatesTable_(sheet, rows, payload) {
  const headers = [
    'Код',
    'Валюта',
    'Номинал',
    'Курс за 1 ед., RUB',
    'Пред. курс за 1 ед., RUB',
    'Изм., RUB',
    'Изм., %',
  ];

  sheet.clear();
  sheet.getRange('A1').setValue('Курсы валют ЦБ РФ');
  sheet.getRange('A2').setValue(`Дата данных: ${payload.Date}`);
  sheet.getRange('A3').setValue(`Предыдущая дата: ${payload.PreviousDate}`);
  sheet.getRange('I1').setValue('Статус');

  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(6, 1, rows.length, headers.length).setValues(rows);

  sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  sheet.getRange(5, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(6, 4, rows.length, 4).setNumberFormat('0.0000');
  sheet.autoResizeColumns(1, 9);
}

function writeStatus_(sheet, message) {
  sheet.getRange('I1').setValue('Статус');
  sheet.getRange(STATUS_CELL).setValue(message);
}

function getOrCreateSheet_(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function round_(value, digits) {
  const multiplier = Math.pow(10, digits);
  return Math.round(value * multiplier) / multiplier;
}
