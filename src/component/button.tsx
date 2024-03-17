import type { ButtonHTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import type { RouterLinkProps } from 'vue-router';
import { RouterLink } from 'vue-router';

type ColorTheme = 'blue' | 'gray' | 'green' | 'red';

const getColorThemeClasses = (colorTheme: ColorTheme) => {
  switch (colorTheme) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'gray':
      return 'bg-gray-600 hover:bg-gray-700';
    case 'green':
      return 'bg-green-600 hover:bg-green-700';
    case 'red':
      return 'bg-red-600 hover:bg-red-700';
  }
};

export const AnchorButton = defineComponent(
  (props: RouterLinkProps & { class?: string; colorTheme: ColorTheme }, { slots }) => {
    return () => (
      <RouterLink
        {...props}
        class={`inline-block px-5 py-2 text-white ${getColorThemeClasses(props.colorTheme)} ${props.class ?? ''}`}
      >
        {slots.default()}
      </RouterLink>
    );
  },
  {
    name: 'AnchorButton',
    props: ['class', 'colorTheme'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Button = defineComponent(
  (props: ButtonHTMLAttributes & { colorTheme: ColorTheme }, { slots }) => {
    return () => (
      <button
        {...props}
        class={`inline-block px-5 py-2 text-white ${getColorThemeClasses(props.colorTheme)} ${props.class ?? ''}`}
      >
        {slots.default()}
      </button>
    );
  },
  {
    name: 'Button',
    props: ['class', 'colorTheme'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);
