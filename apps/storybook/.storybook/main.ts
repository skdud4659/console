import { join, dirname } from "path";
import type { StorybookConfig } from "@storybook/vue-vite";

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/vue-vite').StorybookConfig } */
const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: [
    '../../../packages/mirinae/src/data-display/**/*.mdx',
    '../../../packages/mirinae/src/data-display/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/feedbacks/**/*.mdx',
    '../../../packages/mirinae/src/feedbacks/**/*.stories.@(js|jsx|ts|tsx)',
    
    '../../../packages/mirinae/src/foundation/**/*.mdx',
    '../../../packages/mirinae/src/foundation/**/*.stories.@(js|jsx|ts|tsx)',
    
    '../../../packages/mirinae/src/inputs/buttons/**/*.mdx',
    '../../../packages/mirinae/src/inputs/buttons/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/checkbox/**/*.mdx',
    '../../../packages/mirinae/src/inputs/checkbox/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/checkbox-group/**/*.mdx',
    '../../../packages/mirinae/src/inputs/checkbox-group/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/context-menu/**/*.mdx',
    '../../../packages/mirinae/src/inputs/context-menu/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/datetime-picker/**/*.mdx',
    '../../../packages/mirinae/src/inputs/datetime-picker/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/dropdown/**/*.mdx',
    '../../../packages/mirinae/src/inputs/dropdown/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/file-uploader/**/*.mdx',
    '../../../packages/mirinae/src/inputs/file-uploader/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/forms/**/*.mdx',
    '../../../packages/mirinae/src/inputs/forms/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/input/**/*.mdx',
    '../../../packages/mirinae/src/inputs/input/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/link/**/*.mdx',
    '../../../packages/mirinae/src/inputs/link/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/radio/**/*.mdx',
    '../../../packages/mirinae/src/inputs/radio/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/radio-group/**/*.mdx',
    '../../../packages/mirinae/src/inputs/radio-group/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/search/**/*.mdx',
    '../../../packages/mirinae/src/inputs/search/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/select-button/**/*.mdx',
    '../../../packages/mirinae/src/inputs/select-button/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/select-card/**/*.mdx',
    '../../../packages/mirinae/src/inputs/select-card/**/*.stories.@(js|jsx|ts|tsx)',

    '../../../packages/mirinae/src/inputs/select-status/**/*.mdx',
    '../../../packages/mirinae/src/inputs/select-status/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-designs"),
    getAbsolutePath("@storybook/addon-storysource"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/vue-vite") as "@storybook/vue-vite",
    options: {},
  },
  previewHead: (head) => {
    return `
      ${head}
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
      <link rel='shortcut icon' type='image/x-icon' href="<%= BASE_URL %>favicon.ico">
      <link rel='manifest' type='image/x-icon' href="<%= BASE_URL %>manifest.json">
      <link rel="apple-touch-icon" href="<%= BASE_URL %>images/icons/icon-192x192.png">
      `
  },
  previewBody: (body) => {
    return `
      ${body}
      <style>
        .sb-show-main.sb-main-centered #storybook-root {
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        }
      </style>
    `
  }
};

export default config;