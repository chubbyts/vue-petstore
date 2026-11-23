import type { VNode } from 'vue';
import { defineComponent } from 'vue';
import type { InvalidParameter } from '../../client/error';
import { cx } from '../class-names';

export const inputClasses = (hasError: boolean): string =>
  cx(
    'min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus',
    hasError ? 'border-danger-field-line bg-danger-field' : 'border-line-control bg-canvas',
  );

export const labelClasses = 'text-sm font-semibold';

export const FieldErrors = defineComponent(
  (props: { id: string; invalidParameters: Array<InvalidParameter> }) => {
    return () =>
      props.invalidParameters.length > 0 ? (
        <ul id={props.id} class="text-danger m-0 list-none p-0 text-[13px]">
          {props.invalidParameters.map((invalidParameter) => (
            <li key={`${invalidParameter.name}-${invalidParameter.reason}`}>{invalidParameter.reason}</li>
          ))}
        </ul>
      ) : null;
  },
  {
    name: 'FieldErrors',
    props: ['id', 'invalidParameters'],
  },
);

export type TextFieldProps = {
  dataTestId?: string;
  id: string;
  label: string | VNode | Array<VNode | string>;
  value: string;
  setValue: (value: string) => void;
  invalidParameters: Array<InvalidParameter>;
  placeholder?: string;
  required?: boolean;
};

export const TextField = defineComponent(
  (props: TextFieldProps) => {
    return () => {
      const hasError = props.invalidParameters.length > 0;
      const errorId = `${props.id}-errors`;

      return (
        <div class="flex flex-col gap-1.5">
          <label for={props.id} class={labelClasses}>
            {props.label}
          </label>
          <input
            data-testid={props.dataTestId}
            id={props.id}
            type="text"
            class={cx('h-11', inputClasses(hasError))}
            aria-required={props.required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            placeholder={props.placeholder}
            value={props.value}
            onInput={(e: Event) => props.setValue((e.target as HTMLInputElement).value)}
          />
          <FieldErrors id={errorId} invalidParameters={props.invalidParameters} />
        </div>
      );
    };
  },
  {
    name: 'TextField',
    props: ['dataTestId', 'id', 'label', 'value', 'setValue', 'invalidParameters', 'placeholder', 'required'],
  },
);
