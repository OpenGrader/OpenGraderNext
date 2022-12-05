export const queryParamToNumber = (param: string | string[] | undefined): number => {
  if (param == null) return -1;
  if (Array.isArray(param)) return parseInt(param[0]);
  return parseInt(param);
};
