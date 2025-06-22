/**
 * Parse to array
 * @param val - any
 * @returns Array
 */
export const toArray = <T extends any = any>(
  val: any,
  isAssign: boolean = false
): T[] => {
  return Array.isArray(val) ? val : isAssign ? [val] : [];
};
