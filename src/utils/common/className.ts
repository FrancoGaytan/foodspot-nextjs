interface IConditionalClassNames {
  [key: string]: boolean;
}

type TClassName = { className: string } | undefined;

/**
 * Generates a className object from provided className and conditional className.
 *
 * This function accepts either a string or an array of strings for the classNames parameter.
 * It can also accept an optional conditionalClassNames object where the keys are className and the values are booleans.
 * The className corresponding to true values in the conditionalClassNames object are included in the final className string.
 *
 * @param classNames - A single className string or an array of className strings to be included.
 * @param conditionalClassNames - An optional object where keys are className and values are booleans.
 *    The className with true values will be included in the final className string.
 * @returns An object with a single property className containing the concatenated className.
 *
 * @example className('my-class', {['conditional-class-1']: true, ['conditional-class-2']: false})
 */
export function className(classNames: string | string[], conditionalClassNames?: IConditionalClassNames): TClassName {
  const classes: string[] = [];

  if (typeof classNames === 'string') {
    classes.push(classNames);
  } else {
    classNames.forEach(className => classes.push(className));
  }

  for (const key in conditionalClassNames) {
    if (conditionalClassNames[key] === true) {
      classes.push(key);
    }
  }

  if (classes.length === 0) {
    return undefined;
  }

  return { className: classes.join(' ') };
}
