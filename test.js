const lowercaseAlphabets = "abcdefghijklmnopqrstuvwxyz";
const uppercaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+{}:\"?><=|[]\\`~;.,/'";
const allStrings = lowercaseAlphabets + uppercaseAlphabets + numbers + symbols;

const formatMap = {
  a: lowercaseAlphabets,
  A: uppercaseAlphabets,
  n: numbers,
  s: symbols,
  x: allStrings,
};

function getRandomString(format) {
  let randomString = "";
  for (const s of format) {
    const strings = formatMap[s];
    if (strings) {
      randomString += strings.charAt(
        Math.floor(Math.random() * strings.length)
      );
    } else {
      randomString += s;
    }
  }
  return randomString;
}

for (let i = 0; i < 10; i++) {
  const s = getRandomString("_aAaAaAnnsssnnnsxx__xxxxxx");
  console.log(s);
}
