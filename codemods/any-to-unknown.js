module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Replace all type annotations of `any` with `unknown`
  root.find(j.TSTypeAnnotation, {
    typeAnnotation: { type: 'TSAnyKeyword' }
  }).forEach(path => {
    path.value.typeAnnotation = j.tsUnknownKeyword();
  });

  // Replace all type parameters of `any` with `unknown`
  root.find(j.TSTypeReference, {
    typeName: { name: 'any' }
  }).forEach(path => {
    path.value.typeName.name = 'unknown';
  });

  return root.toSource();
}; 