function _formatterNormalize(formatter) {
  if (typeof formatter === "function") {
    return formatter;
  }
  if (typeof formatter !== "string") {
    throw new TypeError("formatter must be string or function");
  }

  if (formatter === "date") {
    formatter = "yyyy-MM-dd";
  } else if (formatter === "datetime") {
    formatter = "yyyy-MM-dd HH:mm:ss";
  }
  return (dateInfo) => {
    return formatter.replace(
      new RegExp(Object.keys(dateInfo).join("|"), "g"),
      function (match) {
        return dateInfo[match];
      }
    );
  };
}

/**
 *
 * @typedef {object} DateInfo
 * @property {string} yyyy
 * @property {string} MM
 * @property {string} dd
 * @property {string} HH
 * @property {string} mm
 * @property {string} ss
 * @property {string} ms
 * @property {string} w 星期(數字) ex:1
 * @property {string} W 星期(文字) ex:一
 *
 * @typedef {(dateInfo:DateInfo)=>string} DateFormatterFunc
 */

const W_Map = {
  "zh-TW": {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日",
  },
  en: {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  },
};

const MMM_Map = {
  "zh-TW": {
    1: "一月",
    2: "二月",
    3: "三月",
    4: "四月",
    5: "五月",
    6: "六月",
    7: "七月",
    8: "八月",
    9: "九月",
    10: "十月",
    11: "十一月",
    12: "十二月",
  },
  en: {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  },
};

const locales = ["zh-TW", "en"];

/**
 * 格式化日期
 * @param {(Date|string)} date
 * @param {string|DateFormatterFunc} formatter yyyy, MM, dd, HH, mm, ss, ms
 * @example 'date' = 'yyyy-MM-dd'
 * @example 'datetime' = 'yyyy-MM-dd HH:mm:ss'
 * @param {object} [options]
 * @param {boolean} [options.isPad]
 * @param {*} [options.defaultValue]
 * @param {"zh-TW" | "en"} [options.locale]
 * @returns
 */
export function formatTime(
  date,
  formatter,
  { isPad = false, defaultValue = "", locale = "zh-TW" } = {}
) {
  if (!locales.includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  if (!date) {
    return defaultValue;
  }
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  // 使用isNaN判斷是不是Invalid Date
  if (isNaN(date)) {
    return defaultValue;
  }
  formatter = _formatterNormalize(formatter);
  const _dateInfo = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
    day: date.getDay(),
  };

  const dateInfo = {
    yyyy: isPad
      ? _dateInfo.year.toString().padStart(4, "0")
      : _dateInfo.year.toString(),
    MMM: MMM_Map[locale][_dateInfo.month],
    MM: isPad
      ? _dateInfo.month.toString().padStart(2, "0")
      : _dateInfo.month.toString(),
    dd: isPad
      ? _dateInfo.date.toString().padStart(2, "0")
      : _dateInfo.date.toString(),
    HH: isPad
      ? _dateInfo.hours.toString().padStart(2, "0")
      : _dateInfo.hours.toString(),
    mm: isPad
      ? _dateInfo.minutes.toString().padStart(2, "0")
      : _dateInfo.minutes.toString(),
    ss: isPad
      ? _dateInfo.seconds.toString().padStart(2, "0")
      : _dateInfo.seconds.toString(),
    ms: isPad
      ? _dateInfo.milliseconds.toString().padStart(3, "0")
      : _dateInfo.milliseconds.toString(),
    w: _dateInfo.day,
    W: W_Map[locale][_dateInfo.day],
  };
  return formatter(dateInfo);
}
