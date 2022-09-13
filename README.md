# 创建项目

使用 vue-ts 模板创建项目，由于该篇文章的重点不是项目的搭建，所以这里就简单带过。

```shell
pnpm create vite my-vue-app --template vue-ts
复制代码
```

# 为什么需要`eslint`与`prettier`

本文主要以实战为主，这里就不过多赘述`eslint`与`prettier`的作用了，不清晰的同学可以查阅一下相关资料。简单来说，就是`eslint`可以保证项目的质量，`prettier`可以保证项目的统一格式、风格。

# 配置 eslint

### 执行安装命令

```shell
pnpm add eslint -D
```

### 执行 eslint 初始化命令

```shell
pnpm eslint --init
```

### 依次初始化选项

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa79f2715964eefb312c585bbd15980~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

```shell
(1) How would you like to use ESLint?
选择：To check syntax and find problems

(2) What type of modules does your project use?
选择：JavaScript modules (import/export)

(3) Which framework does your project use?
选择：Vue.js

(4) Does your project use TypeScript?
选择：Yes

(5) Where does your code run?
选择：Browser

(6) What format do you want your config file to be in?
选择：JavaScript

(7) Would you like to install them now?
选择：Yes

(8) Which package manager do you want to use?
选择：pnpm
```

### 依赖安装完成后，会生成`.eslintrc.js`配置文件

```javsscript
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

此时打开`.eslintrc.js`配置文件会出现一个报错，需要再`env`字段中增加`node: true`配置以解决 eslint 找不到 module 的报错

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a22f6503db244fc95a1de39c0481d60~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

```diff
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        // 新增
+        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

### 在`package.json`文件中的`script`中添加`lint`命令

```json
{
  "scripts": {
    // eslint . 为指定lint当前项目中的文件
    // --ext 为指定lint哪些后缀的文件
    // --fix 开启自动修复
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
  }
}
```

### 执行`lint`命令

```shell
pnpm lint
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efbdb0b1fa3f4d3b9225a986c9423aeb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?) 这时候命令行中会显示出上图中的报错，意思就是在解析`.vue`后缀的文件时候出现解析错误`parsing error`。

查阅资料后发现，`eslint`默认是不会解析`.vue`后缀文件的。因此，需要一个额外的解析器来解析`.vue`后缀文件。

但是我们查看`.eslintrc.js`文件中的`extends`会发现已经有继承`"plugin:vue/vue3-essential"`的配置。然后在`node_modules`中可以找到`eslint-plugin-vue/lib/cinfigs/essential`，里面配置了`extends`是继承于同级目录下的`base.js`，在里面会发现`parser: require.resolve('vue-eslint-parser')`这个配置。因此，按道理来说应该是会解析`.vue`后缀文件的。

继续往下看`.eslintrc.js`文件中的`extends`会发现，`extends`中还有一个`"plugin:@typescript-eslint/recommended"`，它是来自于`/node_modules/@typescript-eslint/eslint-plugin/dist/configs/recommended.js`，查看该文件会发现最终继承于同级目录下的`base.js`文件。从该文件中可以发现`parser: '@typescript-eslint/parser',`配置。

按照`.eslintrc.js`文件中的`extends`配置的顺序可知，最终导致报错的原因就是`@typescript-eslint/parser`把`vue-eslint-parser`覆盖了。

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

查看[eslint-plugin-vue](https://link.juejin.cn?target=https%3A%2F%2Feslint.vuejs.org%2Fuser-guide%2F%23faq)官方文档可知。如果已经使用了另外的解析器（例如`"parser": "@typescript-eslint/parser"`），则需要将其移至`parseOptions`，这样才不会与`vue-eslint-parser`冲突。

修改`.eslintrc.js`文件

```json
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

两个`parser`的区别在于，外面的`parser`用来解析`.vue`后缀文件，使得`eslint`能解析`<template>`标签中的内容，而`parserOptions`中的`parser`，即`@typescript-eslint/parser`用来解析 vue 文件中`<script>`标签中的代码。

此时，再执行`pnpm lint`，就会发现校验通过了。

### 安装 vscode 插件[ESLint](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Ddbaeumer.vscode-eslint)

如果写一行代码就要执行一遍`lint`命令，这效率就太低了。所以我们可以配合 vscode 的`ESLint`插件，实现每次保存代码时，自动执行`lint`命令来修复代码的错误。

在项目中新建`.vscode/settings.json`文件，然后在其中加入以下配置。

```json
{
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true
  }
}
```

### 安装依赖说明

- [eslint](https://link.juejin.cn?target=https%3A%2F%2Fcn.eslint.org%2F)： JavaScript 和 JSX 检查工具
- [eslint-plugin-vue](https://link.juejin.cn?target=https%3A%2F%2Feslint.vuejs.org%2F)： 使用 ESLint 检查 .vue 文件 的 `<template>` 和 `<script>`，以及`.js`文件中的 Vue 代码

# 配置 prettier

### 执行安装命令

```shell
pnpm add prettier -D
复制代码
```

### 在根目录下新建`.prettierrc.js`

添加以下配置，更多配置可查看[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fprettier.io%2Fdocs%2Fen%2Foptions.html)

```javascript
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为80
  printWidth: 80,
  // 一个tab代表几个空格数，默认为80
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: true,
  // 行位是否使用分号，默认为true
  semi: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: 'none',
  // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true
}
```

### 在`package.json`中的`script`中添加以下命令

```json
{
  "scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\""
  }
}
```

运行该命令，会将我们项目中的文件都格式化一遍，**后续如果添加其他格式的文件，可在该命令中添加，例如：`.less`后缀的文件**

### 安装 vscode 的[Prettier - Code formatter](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Desbenp.prettier-vscode)插件

安装该插件的目的是，让该插件在我们保存的时候自动完成格式化

在`.vscode/settings.json`中添加一下规则

```json
{
  // 保存的时候自动格式化
  "editor.formatOnSave": true,
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

# 解决`eslint`与`prettier`的冲突

在理想的状态下，`eslint`与`prettier`应该各司其职。`eslint`负责我们的代码质量，`prettier`负责我们的代码格式。但是在使用的过程中会发现，由于我们开启了自动化的`eslint`修复与自动化的根据`prettier`来格式化代码。所以我们已保存代码，会出现屏幕闪一起后又恢复到了报错的状态。

这其中的根本原因就是`eslint`有部分规则与`prettier`冲突了，所以保存的时候显示运行了`eslint`的修复命令，然后再运行`prettier`格式化，所以就会出现屏幕闪一下然后又恢复到报错的现象。这时候你可以检查一下是否存在冲突的规则。

查阅资料会发现，社区已经为我们提供了一个非常成熟的方案，即`eslint-config-prettier` + `eslint-plugin-prettier`。

- [eslint-plugin-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-plugin-prettier)： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 pretter 规则来格式化代码。
- [eslint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-config-prettier)： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，**确保将其放在 extends 队列最后，这样它将覆盖其他配置**

### 安装依赖

```shell
pnpm add eslint-config-prettier eslint-plugin-prettier -D
复制代码
```

### 在 `.eslintrc.json`中`extends`的最后添加一个配置

```json
{
    extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
+    // 新增，必须放在最后面
+    'plugin:prettier/recommended'
  ],
}

```

最后**重启 vscode**，你会发现冲突消失了，`eslint`与`prettier`也按照我们预想的各司其职了。

# 配置 styleling

[stylelint](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2F)为 css 的 lint 工具。可格式化 css 代码，检查 css 语法错误与不合理的写法，指定 css 书写顺序等...

### 安装依赖

由于我的项目使用的 less 预处理器，因此配置的为 less 相关的，项目中使用其他预处理器的可以按照该配置方法改一下就好

stylelint v13 版本将 css, parse CSS(如 SCSS,SASS),html 内的 css(如\*.vue 中的 style)等编译工具都包含在内。但是 v14 版本没有包含在内，所以需要安装需要的工具

```shell
pnpm add stylelint postcss postcss-less postcss-html stylelint-config-prettier stylelint-config-recommended-less stylelint-config-standard stylelint-config-standard-vue stylelint-less stylelint-order -D
```

依赖说明

- [stylelint](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2F): `css`样式 lint 工具
- [postcss](https://link.juejin.cn?target=https%3A%2F%2Fwww.postcss.com.cn%2F): 转换`css`代码工具
- [postcss-less](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshellscape%2Fpostcss-less): 识别`less`语法
- [postcss-html](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgucong3000%2Fpostcss-html): 识别 html/vue 中的`<style></style>`标签中的样式
- [stylelint-config-standard](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstylelint%2Fstylelint-config-standard): `Stylelint`的标准可共享配置规则，详细可查看官方文档
- [stylelint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Fstylelint-config-prettier): 关闭所有不必要或可能与`Prettier`冲突的规则
- [stylelint-config-recommended-less](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fssivanatarajan%2Fstylelint-config-recommended-less): `less`的推荐可共享配置规则，详细可查看官方文档
- [stylelint-config-standard-vue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fota-meshi%2Fstylelint-config-standard-vue): lint`.vue`文件的样式配置
- [stylelint-less](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fssivanatarajan%2Fstylelint-less): `stylelint-config-recommended-less`的依赖，`less`的`stylelint`规则集合
- [stylelint-order](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhudochenkov%2Fstylelint-order): 指定样式书写的顺序，在`.stylelintrc.js`中`order/properties-order`指定顺序

### 增加`.stylelintrc.js`配置文件

```javascript
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-less',
    'stylelint-config-standard-vue'
  ],
  plugins: ['stylelint-order'],
  // 不同格式的文件指定自定义语法
  overrides: [
    {
      files: ['**/*.(less|css|vue|html)'],
      customSyntax: 'postcss-less'
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml'
  ],
  rules: {
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep']
      }
    ],
    // 指定样式的排序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'justify-content',
      'align-items',
      'float',
      'clear',
      'overflow',
      'overflow-x',
      'overflow-y',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'font-size',
      'font-family',
      'text-align',
      'text-justify',
      'text-indent',
      'text-overflow',
      'text-decoration',
      'white-space',
      'color',
      'background',
      'background-position',
      'background-repeat',
      'background-size',
      'background-color',
      'background-clip',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'opacity',
      'filter',
      'list-style',
      'outline',
      'visibility',
      'box-shadow',
      'text-shadow',
      'resize',
      'transition'
    ]
  }
}
```

### `package.json`增加命令

```json
"scripts": {
    "prepare": "husky install",
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
+   "lint:style": "stylelint \"./**/*.{css,less,vue,html}\" --fix"
},
```

### 安装 vscode 的[Stylelint](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dstylelint.vscode-stylelint)插件

安装该插件可在我们保存代码时自动执行 stylelint

在`.vscode/settings.json`中添加一下规则

```json
{
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true,
+   "source.fixAll.stylelint": true
  },
  // 保存的时候自动格式化
  "editor.formatOnSave": true,
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 配置该项，新建文件时默认就是space：2
  "editor.tabSize": 2,
  // stylelint校验的文件格式
+ "stylelint.validate": ["css", "less", "vue", "html"]
}
```

# 配置 husky

虽然上面已经配置好了`eslint`、`preitter`与`stylelint`，但是还是存在以下问题。

对于不使用`vscode`的，或者没有安装`eslint`、`preitter`与`stylelint`插件的同学来说，就不能实现在保存的时候自动的去修复与和格式化代码。

这样提交到`git`仓库的代码还是不符合要求的。因此需要引入强制的手段来保证提交到`git`仓库的代码时符合我们的要求的。

`husky`是一个用来管理`git hook`的工具，`git hook`即在我们使用`git`提交代码的过程中会触发的钩子。

### 安装依赖

```shell
pnpm add husky -D
```

### 在`package.json`中的`script`中添加一条脚本命令

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

该命令会在`pnpm install`之后运行，这样其他克隆该项目的同学就在装包的时候就会自动执行该命令来安装`husky`。这里我们就不重新执行`pnpm install`了，直接执行`pnpm prepare`，这个时候你会发现多了一个`.husky`目录。

然后使用`husky`命令添加`pre-commit`钩子，运行

```shell
pnpm husky add .husky/pre-commit "pnpm lint && pnpm format && pnpm lint:style"
```

执行完上面的命令后，会在`.husky`目录下生成一个`pre-commit`文件

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint && pnpm format
```

现在当我们执行`git commit`的时候就会执行`pnpm lint`与`pnpm format`，当这两条命令出现报错，就不会提交成功。以此来保证提交代码的质量和格式。

使用`husky`命令添加`commit-msg`钩子，运行

```shell
pnpm husky add .husky/commit-msg "npx commitlint --edit "$1""
```

执行完上面的命令后，会在`.husky`目录下生成一个`commit-msg`文件

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit "$1"
```

再根目录创建 commitlint.config.js 文件，内容如下。添加对提交信息的规范校验。

```json
module.exports = {
    extends: ["@commitlint/config-conventional"],
    // 以下时我们自定义的规则
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "bug", // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
                "feat", // 新功能（feature）
                "fix", // 修补bug
                "docs", // 文档（documentation）
                "style", // 格式（不影响代码运行的变动）
                "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
                "test", // 增加测试
                "chore", // 构建过程或辅助工具的变动
                "revert", // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
                "merge" // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
            ]
        ]
    }
};

```

现在当我们执行`git commit`的时候就会执行`npx commitlint`，当这条命令出现报错，就不会提交成功。以此来保证提交信息的规范性。

# 总结

本篇文章主要是以一个`vue-ts-vite`的项目的搭建为基础，在项目中引入`eslint + prettier + husky`来规范项目。完整的代码已经上传至`github`，[点击此处](https://github.com/cj620/vue-latest-template)可以查看完整代码。

# 参考文章

[# 实战--为 vite-vue3-ts 项目添加 eslint + prettier + lint-staged 项目规范](https://juejin.cn/post/7043702363156119565)
