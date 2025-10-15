module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential', // o vue3-strongly-recommended, según prefieras
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/no-deprecated-slot-attribute': 'off', // ✅ Desactiva el falso positivo de Ionic
  },
}
