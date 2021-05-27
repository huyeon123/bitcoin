function required(v) {
  if (!!v == false) {
    return "입력을 비울 수 없습니다.";
  }

  return true;
}

function realNumber(v) {
  if (v == 0) {
    return true;
  }

  if (!(v * 1)) {
    return "숫자를 입력하십시오.";
  }

  return true;
}

function integer(v) {
  if (Number.isInteger(v * 1)) {
    return true;
  }

  return "정수를 입력하십시오.";
}

function positiveNumber(v) {
  if (realNumber(v) === true) {
    if (v > 0) {
      return true;
    } else {
      return "양수를 입력하십시오.";
    }
  } else {
    return "숫자를 입력하십시오.";
  }
}

function numberOnly(v) {
  v = String(v);

  for (let i = 0; i < v.length; i++) {
    if (isNaN(v[i] * 1)) {
      return "숫자만 입력해 주십시오.";
    }
  }

  return true;

}

export default {
  required: required,
  realNumber: realNumber,
  integer: integer,
  positiveNumber: positiveNumber,
  numberOnly: numberOnly
} ;
