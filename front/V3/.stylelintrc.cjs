module.exports = {
  extends: ['stylelint-config-recommended-vue/scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  rules: {
    'alpha-value-notation': null,
    'at-rule-no-unknown': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'color-hex-length': null,
    'declaration-empty-line-before': null,
    'media-feature-range-notation': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
  },
};
