// Configuração customizada do commitlint
// Aceita o padrão de commits com emoji: ✨ Feat: descrição
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Desabilitar regras que conflitam com o padrão de emoji
    'type-enum': [0], // Desabilitar validação de tipo (emoji substitui)
    'type-empty': [0], // Permitir "tipo vazio" (o emoji é o tipo)
    'subject-empty': [0], // Flexibilizar
    'header-max-length': [2, 'always', 120], // Aumentar limite por causa dos emojis
  },
  // Parser customizado para aceitar formato com emoji
  parserPreset: {
    parserOpts: {
      headerPattern: /^.+$/,
      headerCorrespondence: ['subject'],
    },
  },
};
