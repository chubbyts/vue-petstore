import type { ButtonHTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import { cx } from './class-names';
import type { LinkProps } from './link';
import { Link } from './link';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'danger-outline'
  // without border, e.g. actions within a table row
  | 'ghost'
  | 'ghost-danger'
  // square, icon only: needs an aria-label (prefer visible text, e.g. ghost with icon and text)
  | 'icon'
  | 'icon-danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonStyleProps = { variant: ButtonVariant; size?: ButtonSize };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary',
  secondary: 'border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg',
  danger: 'bg-danger-solid font-semibold text-white hover:bg-danger-solid/85 hover:text-white',
  'danger-outline': 'border border-danger font-semibold text-danger hover:bg-danger-surface-hover hover:text-danger',
  ghost: 'font-medium text-fg-muted hover:bg-line hover:text-fg',
  'ghost-danger': 'font-medium text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover',
  icon: 'text-fg-muted hover:bg-line hover:text-fg',
  'icon-danger': 'text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3',
  md: 'h-10 rounded-lg px-3',
  lg: 'h-11 rounded-control px-4',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'size-9 rounded-lg',
  md: 'size-10 rounded-lg',
  lg: 'size-11 rounded-control',
};

export const buttonClasses = ({ variant, size = 'lg' }: ButtonStyleProps): string => {
  const sizeClass = variant === 'icon' || variant === 'icon-danger' ? iconSizeClasses[size] : sizeClasses[size];

  return `inline-flex shrink-0 items-center justify-center gap-2 no-underline ${sizeClass} ${variantClasses[variant]}`;
};

export type AnchorButtonProps = LinkProps & ButtonStyleProps;

export const AnchorButton = defineComponent(
  (props: AnchorButtonProps, { slots }) => {
    return () => (
      <Link to={props.to} class={cx(buttonClasses({ variant: props.variant, size: props.size }), props.class)}>
        {slots.default?.()}
      </Link>
    );
  },
  {
    name: 'AnchorButton',
    props: ['to', 'class', 'variant', 'size'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type ButtonProps = ButtonHTMLAttributes & ButtonStyleProps & { class?: string };

export const Button = defineComponent(
  (props: ButtonProps, { slots }) => {
    return () => (
      <button
        type={props.type ?? 'button'}
        class={cx(buttonClasses({ variant: props.variant, size: props.size }), props.class)}
      >
        {slots.default?.()}
      </button>
    );
  },
  {
    name: 'Button',
    props: ['type', 'class', 'variant', 'size'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);
