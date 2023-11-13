module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "react/prop-types": 0,
    "no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn"] }],
    "react/jsx-filename-extension": [0, { "allow": "as-needed" }],
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/media-has-caption": [ 0, {
      "audio": [ "Audio" ],
      "video": [ "Video" ],
      "track": [ "Track" ],
    }],
    "jsx-a11y/label-has-associated-control": [ 0, {
      "labelComponents": ["CustomLabel"],
      "labelAttributes": ["inputLabel"],
      "controlComponents": ["CustomInput"],
      "assert": "both",
      "depth": 3,
    }],
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "react/react-in-jsx-scope": "off",
    "class-methods-use-this": "off",
    "ignoreDestructuring": true
  }
};
