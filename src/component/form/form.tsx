import type { FieldsetHTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import type { InvalidParameter } from '../../client/error';

export const FieldSet = defineComponent(
  (props: FieldsetHTMLAttributes, { slots }) => {
    return () => (
      <fieldset {...props} class={`mb-3 border border-gray-300 px-4 py-3 ${props.class ?? ''}`}>
        {slots.default()}
      </fieldset>
    );
  },
  {
    name: 'FieldSet',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const TextField = defineComponent(
  (props: {
    dataTestId: string;
    label: string;
    value: string;
    setValue: (value: string) => void;
    invalidParameters: Array<InvalidParameter>;
  }) => {
    return () => (
      <label class={`block ${props.invalidParameters.length > 0 ? 'text-red-600' : ''} `}>
        {props.label}
        <input
          data-testid={props.dataTestId}
          type="text"
          class={`mt-2 mb-3 block w-full border px-3 py-2 ${
            props.invalidParameters.length > 0 ? 'border-red-600 bg-red-100' : 'border-gray-300'
          }`}
          // @ts-expect-error target should always exist and should have a value
          onBlur={(e) => props.setValue(e.currentTarget.value)}
          onKeydown={(e) => {
            if (e.code !== 'Enter') {
              return;
            }

            // @ts-expect-error target should always exist and should have a value
            props.setValue(e.currentTarget.value);
          }}
          value={props.value}
        />
        {props.invalidParameters.length > 0 ? (
          <ul class="mb-3">
            {props.invalidParameters.map((invalidParameter, i) => (
              <li key={i}>{invalidParameter.reason}</li>
            ))}
          </ul>
        ) : null}
      </label>
    );
  },
  {
    name: 'TextField',
    props: ['dataTestId', 'label', 'value', 'setValue', 'invalidParameters'],
  },
);
