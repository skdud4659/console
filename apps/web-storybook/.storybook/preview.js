import Vue from 'vue';


import { i18n } from '@/translations';
import VTooltip from 'v-tooltip';
import velocity from 'velocity-animate';
import Fragment from 'vue-fragment';
import VueI18n from 'vue-i18n';
import Notifications from 'vue-notification';
import VueRouter from 'vue-router';
import webFontLoader from 'webfontloader';

import screens from 'mirinae-foundation/screens.cjs';

import { fontUrls, webFonts } from 'mirinae-foundation/web-fonts.cjs';

import SpaceOneTheme from './CloudforetTheme';
import SpaceDesignSystem from '@cloudforet/mirinae';

import '@/styles/style.pcss';
import '@cloudforet/mirinae/css/light-style.css';
import '@cloudforet/mirinae/dist/style.css';

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(Notifications, { velocity });

Vue.use(Fragment.Plugin);
Vue.use(VTooltip, { defaultClass: 'p-tooltip', defaultBoundariesElement: document.body });
Vue.use(SpaceDesignSystem, { vueI18n: i18n });

Vue.prototype.toJSON = function () {
    return this;
};

webFontLoader.load({
    google: {
        families: webFonts,
        urls: fontUrls,
    },
});

const viewports = {};
Object.keys(screens).forEach((k) => {
    const v = screens[k];
    viewports[k] = {
        name: k,
        styles: {
            width: v.min || v.max,
            height: '100%',
        },
    };
});

const preview = {
  parameters : {
    controls: { expanded: true },
    layout: 'centered',
    docs: {
        extractComponentDescription: (component, { notes }) => {
            if (notes) {
                return typeof notes === 'string' ? notes : notes.markdown || notes.text;
            }
            return null;
        },
        theme: SpaceOneTheme,
    },
    viewport: {
        viewports,
    },
    options: {
      storySort: (a, b) => a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),
    },
    actions: { argTypesRegex: '^on.*' },
  },
  decorators: [
    (story, { globals: { locale } }) => {
        i18n.locale = locale;
        return {
            components: { story },
            i18n,
            router: new VueRouter(),
            template: '<story/>',
        };
    },
  ],
  globalTypes: {
    locale: {
      name: 'locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
          icon: 'globe',
          items: [
              { value: 'en', right: '🇺🇸', title: 'English' },
              { value: 'ko', right: '🇰🇷', title: '한국어' },
              { value: 'jp', right: '🇯🇵', title: '日本語' },
          ],
      },
    },
  }
};

export default preview;
