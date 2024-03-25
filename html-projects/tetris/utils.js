function castToBool(val) {
  if (/^(true|1)$/i.test(String(val))) return true;
  if (/^(false|0)$/i.test(String(val))) return false;
}

function numberToBinaryStr(num, len) {
  return num.toString(2).padStart(len, "0");
}

function delay(secs) {
  return new Promise((res) => setTimeout(res, secs * 1000));
}
