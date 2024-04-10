function _formatterNormalize(formatter) {
  if (typeof formatter === "function") {
    return formatter;
  }
  if (typeof formatter !== "string") {
    throw new TypeError("formatter must be string or function");
  }

  if (formatter === "date") {
    formatter = "yyyy-MM-DD";
  } else if (formatter === "datetime") {
    formatter = "yyyy-MM-DD HH:mm:ss";
  }

  return (dateInfo) => {
    const keys = Object.keys(dateInfo).sort((a, b) => b.length - a.length);
    return formatter.replace(new RegExp(keys.join("|"), "g"), function (match) {
      return dateInfo[match];
    });
  };
}

const maps = {
  ...(() => {
    const zh =
      "_一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
        "_"
      );

    return {
      MMM: {
        "zh-TW": zh,
        en: "_Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      },
      MMMM: {
        "zh-TW": zh,
        en: "_January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
      },
    };
  })(),

  ...(() => {
    return {
      dd: {
        "zh-TW": "日_一_二_三_四_五_六".split("_"),
        en: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      },
      ddd: {
        "zh-TW": "週日_週一_週二_週三_週四_週五_週六".split("_"),
        en: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      },
      dddd: {
        "zh-TW": "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        en: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
      },
    };
  })(),
};

/**
 * @typedef {Object} DateInfo
 * @property {string} Y - 年份的四位數字表示。
 * @property {string} YY - 年份的兩位數字表示。
 * @property {string} YYYY - 年份的四位數字表示。
 * @property {string} y - 年份的四位數字表示。
 * @property {string} yy - 年份的四位數字表示。
 * @property {string} yyy - 年份的四位數字表示。
 * @property {string} yyyy - 年份的四位數字表示。
 *
 * @property {string} M - 月份的數字表示（從 1 開始）。
 * @property {string} MM - 月份的零補位數字表示（01-12）。
 * @property {string} MMM - 月份的簡寫表示。
 * @property {string} MMMM - 月份的全稱表示。
 * @property {string} m - 分鐘數的數字表示。
 * @property {string} mm - 分鐘數的零補位數字表示（00-59）。
 *
 * @property {string} D - 日期的數字表示（1-31）。
 * @property {string} DD - 日期的零補位數字表示（01-31）。
 * @property {string} d - 星期幾的數字表示（0-6）。
 * @property {string} dd - 星期幾的簡寫表示。
 * @property {string} ddd - 星期幾的簡寫表示。
 * @property {string} dddd - 星期幾的全稱表示。
 *
 * @property {string} H - 小時的數字表示（0-23）。
 * @property {string} HH - 小時的零補位數字表示（00-23）。
 *
 * @property {string} S - 毫秒的數字表示（擷取第一位）。
 * @property {string} SS - 毫秒的數字表示（擷取前兩位，補 0）。
 * @property {string} SSS - 毫秒的數字表示（000-999）。
 * @property {string} s - 秒數的數字表示（0-59）。
 * @property {string} ss - 秒數的零補位數字表示（00-59）。
 *
 *
 * @typedef {(dateInfo:DateInfo)=>string} DateFormatterFunc
 * @typedef {string | Date} TimeFormatterInputDate
 * @typedef {DateFormatterFunc | string} TimeFormatterInputFormatter
 *
 * @typedef TimeFormatterOptions
 * @property {"zh-TW" | "en"} [locale]
 * @property {any} [defaultValue]
 *
 */

const locales = ["zh-TW", "en"];

/**
 * 建立時間格式化器
 * @param {TimeFormatterInputDate} date
 * @returns
 */
export function createTimeFormatter(date) {
  /**
   * @param {string} formatter
   * @param {TimeFormatterOptions} [options]
   * @returns
   */
  return (formatter, options) => formatTime(date, formatter, options);
}

/**
 * 格式化時間
 * @param {TimeFormatterInputDate} date
 * @param {TimeFormatterInputFormatter} formatter
 * @param {TimeFormatterOptions} [options]
 * @returns {string}
 */
export function formatTime(
  date,
  formatter,
  { defaultValue = "", locale = "zh-TW" } = {}
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
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString(),
    date: date.getDate().toString(),
    hours: date.getHours().toString(),
    minutes: date.getMinutes().toString(),
    seconds: date.getSeconds().toString(),
    milliseconds: date.getMilliseconds().toString(),
    day: date.getDay().toString(),
  };

  /**
   * @see {@link https://en.wikipedia.org/wiki/ISO_8601}
   */
  const dateInfo = {
    get Y() {
      return _dateInfo.year;
    },
    get YY() {
      return this.Y.slice(2);
    },
    get YYYY() {
      return this.Y;
    },

    get y() {
      return this.Y;
    },
    get yy() {
      return this.Y;
    },
    get yyy() {
      return this.Y;
    },
    get yyyy() {
      return this.Y;
    },

    get M() {
      return _dateInfo.month;
    },
    get MM() {
      return this.M.padStart(2, "0");
    },
    get MMM() {
      return maps.MMM[locale][_dateInfo.month];
    },
    get MMMM() {
      return maps.MMMM[locale][_dateInfo.month];
    },

    get m() {
      return _dateInfo.minutes;
    },
    get mm() {
      return _dateInfo.minutes.padStart(2, "0");
    },

    get D() {
      return _dateInfo.date;
    },
    get DD() {
      return this.D.padStart(2, "0");
    },
    /**
     * TODO DDD ordinal date
     */

    get d() {
      return _dateInfo.day;
    },
    get dd() {
      return maps.dd[locale][_dateInfo.day];
    },
    get ddd() {
      return maps.ddd[locale][_dateInfo.day];
    },
    get dddd() {
      return maps.dddd[locale][_dateInfo.day];
    },

    get H() {
      return _dateInfo.hours;
    },
    get HH() {
      return this.H.padStart(2, "0");
    },

    get h() {
      return this.H;
    },
    get hh() {
      return this.HH;
    },

    get S() {
      return _dateInfo.milliseconds.slice(0, 1).padEnd(1, "0");
    },
    get SS() {
      return _dateInfo.milliseconds.slice(0, 2).padEnd(2, "0");
    },
    get SSS() {
      return _dateInfo.milliseconds.padEnd(3, "0");
    },

    get s() {
      return _dateInfo.seconds;
    },
    get ss() {
      return this.s.padStart(2, "0");
    },

    /**
     * TODO W / w
     */
  };

  /**
   * @typedef {typeof dateInfo} T
   */

  return formatter(dateInfo);
}

// console.group();
// const time = "2024-04-09 07:02:04";
// const log = (key, times = 4) => {
//   const keys = Array.from({ length: times }).map((_, i) =>
//     Array.from({ length: i + 1 }, () => key).join("")
//   );
//   console.group(key, time);
//   for (const k of keys) {
//     console.log(k, formatTime(time, k, { locale: "en" }));
//   }
//   console.groupEnd();
// };
// log("Y");
// log("y");
// log("M");
// log("m");
// log("D");
// log("d");
// log("H");
// log("h");
// log("M");
// log("m");
// log("S");
// log("s");
// log("W");
// log("w");

// console.groupEnd();
