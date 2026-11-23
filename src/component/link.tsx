import type { AnchorHTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

export type LinkProps = AnchorHTMLAttributes & { to: string; class?: string };

// a plain anchor (without the active classes of RouterLink), navigating within the app
export const Link = defineComponent(
  (props: LinkProps, { slots, attrs }) => {
    return () => (
      <RouterLink to={props.to} custom>
        {({ href, navigate }: { href: string; navigate: (e?: MouseEvent) => Promise<unknown> }) => (
          <a
            {...attrs}
            href={href}
            class={props.class}
            onClick={(e: MouseEvent) => {
              const onClick = attrs.onClick as ((e: MouseEvent) => void) | undefined;

              if (onClick) {
                onClick(e);
              }

              // the router does not navigate if the event got prevented (e.g. a disabled link)
              void navigate(e);
            }}
          >
            {slots.default?.()}
          </a>
        )}
      </RouterLink>
    );
  },
  {
    name: 'Link',
    props: ['to', 'class'],
    inheritAttrs: false,
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type NavLinkProps = AnchorHTMLAttributes & {
  to: string;
  // only active on exactly this path, not on the paths below
  end?: boolean;
  // a function (vue would normalize a function given as class)
  classes: (props: { isActive: boolean }) => string;
};

// a link within the navigation: marked as current page (aria-current) if active
export const NavLink = defineComponent(
  (props: NavLinkProps, { slots, attrs }) => {
    const route = useRoute();

    return () => {
      const isActive = props.end
        ? route.path === props.to
        : route.path === props.to || route.path.startsWith(`${props.to}/`);

      return (
        <Link {...attrs} to={props.to} aria-current={isActive ? 'page' : undefined} class={props.classes({ isActive })}>
          {slots.default?.()}
        </Link>
      );
    };
  },
  {
    name: 'NavLink',
    props: ['to', 'end', 'classes'],
    inheritAttrs: false,
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);
