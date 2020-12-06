function is(prev: any, next: any) {
  if (prev === next) {
    return prev !== 0 || next !== 0 || 1 / prev === 1 / next;
  } else {
    // eslint-disable-next-line no-self-compare
    return prev !== prev && next !== next;
  }
}

function shallowEqual(prev: any, next: any) {
  if (is(prev, next)) return true;

  if (
    typeof prev !== 'object' ||
    prev === null ||
    typeof next !== 'object' ||
    next === null
  ) {
    return false;
  }

  const keysA = Object.keys(prev);
  const keysB = Object.keys(next);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(next, keysA[i]) ||
      !is(prev[keysA[i]], next[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

export default shallowEqual;
