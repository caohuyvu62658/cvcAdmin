import { FilterState, OptionState } from "../typings/datatable";
const getUrl = (key: string): string => {
  let pathInfo = key.split("_");
  pathInfo = pathInfo.filter((item) => {
    return item != "item";
  });
  return pathInfo.join("/");
}
const formatSize = (fileSize: number) => {
  if (fileSize === 0) {
    return "Unknown";
  } else {
    const i = Math.floor(Math.log(fileSize) / Math.log(1024));
    const size = ((fileSize / Math.pow(1024, i)) * 1).toFixed(2);
    return `${size} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
  }
}
const convertFilter = (array: OptionState): FilterState => {
  return array.map((item) => {
    return {
      text: item.label,
      value: item.value
    }
  });
}
const numberFormat = (num?: string | number, prefix?: string): string => {
  try {
    if (num) {
      num = (num + '').replace(/[^0-9+\-Ee.]/g, '');
      let n = !isFinite(+num) ? 0 : +num;
      let prec = 6;
      let sep = ',';
      let dec = '.';
      let s: any = '';
      let toFixedFix = (ns: any, precs: any) => {
        if (('' + ns).indexOf('e') === -1) {
          let vls: any = ns + 'e+' + precs;
          return +(Math.round(vls) + 'e-' + prec);
        } else {
          let arr = ('' + n).split('e');
          let sig = '';
          if (+arr[1] + precs > 0) {
            sig = '+';
          }
          let vlss: any = +arr[0] + 'e' + sig + (+arr[1] + precs);
          let vlsss = (+(Math.round(vlss)) + 'e-' + precs);
          return Number(vlsss).toFixed(precs);
        }
      }
      s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      let result = s.join(dec);
      if (prefix) result = prefix + result;
      return result;
    } else {
      return "0";
    }
  } catch (ex) {
    return "0";
  }
}
const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const removeHtml = (str: string) => {
  return str.replace(/<(?:.|\n)*?>/gm, '');
}
const cutString = (str: string, length: number) => {
  str = str.replace(/\"/gm, "'").trim();
  str = removeHtml(str);
  if (str.length < length) return str;
  else {
    str = str.substring(0, length) + " ...";
    return str;
  }
}
const getTimezoneOffset = (timeZone: string) => {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', { timeZone });
  const localString = now.toLocaleString('en-US');
  const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
  let offset = diff + now.getTimezoneOffset() / 60;
  offset = -offset;

  const hours = Math.floor(offset);
  const minutes = Math.round((offset - hours) * 60);
  return `${offset < 0 ? '-' : '+'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`.replace(/\-\-/gm, "-");
}
const getUrlFlag = (country: string) => {
  return `/flags/${country}.svg`;
}
/**
 * Hàm viết hoa chữ cái đầu tiên
 * @param str Chữ cần viết hoa chữ cái đầu
 * @returns string
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const calcSize = (widthPercent: number): {
  width: number,
  height: number
} => {
  const width = (window.innerWidth / 100 * widthPercent) > 1920 ? 1600 : (window.innerWidth / 100 * widthPercent);
  const height = width * 1080 / 1920;
  return {
    width,
    height
  }
}
export {
  getUrl,
  formatSize,
  convertFilter,
  numberFormat,
  sleep,
  removeHtml,
  cutString,
  getTimezoneOffset,
  getUrlFlag,
  capitalize,
  calcSize
}