/** @type {import("html-validate").ConfigData} */
module.exports = {
  extends: ["html-validate:recommended"],
  rules: {
    // Estilo do projeto: elementos vazios com autofechamento (<meta />, <img />).
    "void-style": ["error", { style: "selfclose" }],
    // TODO(M1): adicionar type="button" aos botões e reativar esta regra.
    "no-implicit-button-type": "off",
  },
};
