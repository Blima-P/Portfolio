/** @type {import("html-validate").ConfigData} */
module.exports = {
  extends: ['html-validate:recommended'],
  rules: {
    // Estilo do projeto: elementos vazios com autofechamento (<meta />, <img />).
    'void-style': ['error', { style: 'selfclose' }],
  },
};
