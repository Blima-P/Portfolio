// Stylelint: config padrão + exceções justificadas.
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Use BEM em kebab-case: bloco__elemento--modificador' },
    ],
    // O Safari ainda precisa de -webkit-background-clip: text para o texto em gradiente.
    'property-no-vendor-prefix': [true, { ignoreProperties: ['background-clip'] }],
    // A notação de intervalo (width <= 900px) só existe a partir do iOS 16.4; a clássica funciona em todos.
    'media-feature-range-notation': 'prefix',
    // Ruidosa com BEM (compara seletores sem relação entre si); reordenar o CSS só por ela traria risco.
    'no-descending-specificity': null,
  },
};
