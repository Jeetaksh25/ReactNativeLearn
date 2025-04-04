module.exports = function (api) {
    api.cache(true);
  
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel"
      ],
      plugins: [
        [
          "module-resolver",
          {
            root: ["./"],
            alias: {
              "@": "./",
              "tailwind.config": "./tailwind.config.js"
            }
          }
        ],
        [
          "module:react-native-dotenv",
          {
            moduleName: "@env",
            path: ".env",
            allowlist: [
              "APPWRITE_ENDPOINT",
              "APPWRITE_PLATFORM",
              "APPWRITE_PROJECT_ID",
              "APPWRITE_DATABASE_ID",
              "APPWRITE_USER_COLLECTION_ID",
              "APPWRITE_VIDEO_COLLECTION_ID",
              "APPWRITE_STORAGE_ID"
            ]
          }
        ]
      ]
    };
  };
  