function is(prev: any, next: any) {
  if (prev === next) {
    return prev !== 0 || next !== 0 || 1 / prev === 1 / next;
  } else {
    // eslint-disable-next-line no-self-compare
    return prev !== prev && next !== next;
  }
}

function isPrimitiveType(data: any) {
  return typeof data !== 'object' || data === null;
}

function isDeepEqual(prev: any, next: any) {
  const keysA = Object.keys(prev);
  const keysB = Object.keys(next);

  if (keysA.length !== keysB.length) return false;

  for (const item of keysA) {
    if (!Object.prototype.hasOwnProperty.call(next, item)) {
      return false;
    } else if (!is(prev[item], next[item])) {
      return false;
    }
  }

  return true;
}

export function shallowEqual(prev: any, next: any) {
  if (is(prev, next)) {
    return true;
  } else if (isPrimitiveType(prev) || isPrimitiveType(next)) {
    // is 함수에서 체크하지 못한 primitive type은 false를 반환
    return false;
  }

  return isDeepEqual(prev, next);
}
