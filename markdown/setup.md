
```ts
/**
 * Setting Up a Node 18 + TypeScript 5.1 + Serverless Framework (AWS
 * Lambda) Project From Scratch
 * 
 * @see https://medium.com/@goradux/setting-up-a-node-18-typescript-serverless-framework-aws-lambda-project-from-scratch-4b36178b6b1c
 */
```

```ts
/**
 * @NOTE: This is just for learning, don't refer below documentation and implemnt in the project without asking team lead
 * 
 * Building a Serverless Node.js Application with ESM and TypeScript in 2024
 * 
 * @see https://garnik.medium.com/building-a-serverless-node-js-application-with-esm-and-typescript-in-2024-34434f7be356
 */
```

1. Root Directory:
```bash
mkdir .codecatalyst environments src 
touch .env .gitignore global.d.ts serverless.ts
```

2. dependencies
```bash
npm i axios
npm i cors
npm i dynamoose
npm i express
npm i joi
npm i luxon
npm i serverless@3.40.0
npm i serverless-http
npm i ulidx
npm i winston
npm i dotenv
npm i aws-lambda
```

3. devDependencies
```sh
npm install <package-name> -D
```
```bash
npm install @serverless/typescript -D
npm install @types/cors -D
npm install @types/express -D
npm install rimraf -D 
npm install serverless-offline@12.0.4 -D
npm install serverless-webpack -D
npm install ts-loader -D
npm install ts-node -D
npm install typescript -D
npm install webpack -D
npm install webpack-cli -D
npm install webpack-dev-server -D
npm install @types/aws-lambda -D
```


# Discuss below with CTO:
   ```ts
   /**
   * @see https://www.serverless.com/framework/docs/providers/aws/guide/building
   *
   * NOTE: ✖ ServerlessError2: Serverless now includes ESBuild and supports Typescript out-of-the-box. But this conflicts with the plugin 'serverless-webpack'.
   * You can either remove this plugin and try Serverless's ESBuild support builtin, or you can set 'build.esbuild' to false in your 'serverless.yml'.
   */
   ```

   ```sh
   npm uninstall serverless-webpack webpack webpack-cli ts-loader webpack-dev-server
   ```

   ```sh
   plugins: ['serverless-webpack']  // ❌ Remove this line
   ```