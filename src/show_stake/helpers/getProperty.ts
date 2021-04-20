const getProperty = (
  object: Record<string, unknown>,
  propertyPath: string
): unknown => {
  const properties = propertyPath.split('.');
  let result = object;
  while (result && properties.length) {
    result = result[properties.shift()] as Record<string, unknown>;
  }
  return result;
};

export default getProperty;
