module.exports = {
  root: true,
  extends: ["next", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
  settings: {
    next: {
      rootDir: ["docs/"],
    },
  },
};
