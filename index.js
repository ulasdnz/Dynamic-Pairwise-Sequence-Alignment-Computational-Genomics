const fs = require("fs");
const FILEPATH = "./test1.seq"

const read = fs.readFileSync(FILEPATH, { encoding: "utf-8" });

let str1 = read.split("\r\n")[0];
let str2 = read.split("\r\n")[1];

let lowerMax = [...Array(str1.length + 1)].map((_) =>
  new Array(str2.length + 1).fill(null)
);

function lower(i, j) {
  if (lowerMax[i][j]) return lowerMax[i][j];

  if (i == 0 && j == 0) {
    const val = 0;
    lowerMax[i][j] = val;
    return val;
  }
  if (i === 0) {
    const val = -1 - (j - 1) * 0.5;
    lowerMax[i][j] = val;
    return val;
  }
  if (j === 0) {
    const val = -1 - (i - 1) * 0.5;
    lowerMax[i][j] = val;
    return val;
  }

  const lowerValue = lower(i - 1, j) - 0.5;
  const middleValue = middle(i - 1, j) - 1;
  const maximum = Math.max(lowerValue, middleValue);
  lowerMax[i][j] = maximum;
  return maximum;
}

let upperMax = [...Array(str1.length + 1)].map((_) =>
  new Array(str2.length + 1).fill(null)
);

function upper(i, j) {
  if (upperMax[i][j]) return upperMax[i][j];

  if (i == 0 && j == 0) {
    upperMax[i][j] = 0;
    return 0;
  }
  if (i === 0) {
    const val = -1 - (j - 1) * 0.5;
    upperMax[i][j] = val;
    return val;
  }
  if (j === 0) {
    const val = -1 - (i - 1) * 0.5;
    upperMax[i][j] = val;
    return val;
  }

  const upperValue = upper(i, j - 1) - 0.5;
  const middleValue = middle(i, j - 1) - 1;
  const maximum = Math.max(upperValue, middleValue);
  upperMax[i][j] = maximum;
  return maximum;
}

let middleMax = [...Array(str1.length + 1)].map((_) =>
  new Array(str2.length + 1).fill(null)
);
function middle(i, j) {
  if (middleMax[i][j]) return middleMax[i][j];
  if (i == 0 && j == 0) {
    const val = 0;
    middleMax[i][j] = val;
    return val;
  }
  if (i === 0) {
    const val = -1 - (j - 1) * 0.5;
    middleMax[i][j] = val;
    return val;
  }
  if (j === 0) {
    const val = -1 - (i - 1) * 0.5;
    middleMax[i][j] = val;
    return val;
  }

  const lowerValue = lower(i, j);
  const upperValue = upper(i, j);
  const middleValue = middle(i - 1, j - 1) + score(i, j);
  const maximum = Math.max(lowerValue, middleValue, upperValue);

  middleMax[i][j] = maximum;
  return maximum;
}

function score(i, j) {
  if (str1[i - 1] === str2[j - 1]) return 3;
  return -1;
}

const resultingScore = middle(str1.length, str2.length);

let seq1 = [];
let seq2 = [];
let seq1Count = 1;
let seq2Count = 1;

traceBack(str1.length, str2.length);
console.log("\n\nAlignment 1:\n");
console.log(seq1.join(""));
console.log("\n\nAlignment 2:\n");
console.log(seq2.join(""));
console.log("\nScore: " + resultingScore + "\n");

function traceBack(i, j) {
  if ((i == 0 && j == 0) || i < 0 || j < 0) {
    return;
  }
  let diag =
    middleMax[i][j] == undefined || middleMax[i][j] == null
      ? -Infinity
      : middleMax[i][j];
  let left =
    upperMax[i][j] == undefined || upperMax[i][j] == null
      ? -Infinity
      : upperMax[i][j];
  let up =
    lowerMax[i][j] == undefined || lowerMax[i][j] == null
      ? -Infinity
      : lowerMax[i][j];

  if (i === 0 || j === 0) diag = -Infinity; // if  the current node is at the top or left most,
  // it's not possible that it came here from a diagonal node.
  if (j == 0) left = -Infinity; // if its already at the left most, it's not possible
  // that it came to the current position from the left node.
  if (i == 0) up = -Infinity; // if current node is at the top most, it's not possible
  // that it came to the current position from the upper node.

  if (diag > left && diag > up) {
    seq1.unshift(str1[str1.length - seq1Count]);
    seq2.unshift(str2[str2.length - seq2Count]);
    seq1Count++;
    seq2Count++;
    traceBack(i - 1, j - 1);
  } else if (up >= diag && up >= left) {
    seq2.unshift("-");
    seq1.unshift(str1[str1.length - seq1Count]);
    seq1Count++;
    traceBack(i - 1, j);
  } else if (left >= diag && left >= up) {
    seq1.unshift("-");
    seq2.unshift(str2[str2.length - seq2Count]);
    seq2Count++;
    traceBack(i, j - 1);
  }
}
