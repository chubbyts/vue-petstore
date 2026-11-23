import { defineComponent } from 'vue';
import { formatDateTime } from '../format';

// machine readable value for assistive technology and browser tools, formatted in the browser's time zone
export const DateTime = defineComponent(
  (props: { value: string }) => {
    return () => <time datetime={props.value}>{formatDateTime(props.value)}</time>;
  },
  {
    name: 'DateTime',
    props: ['value'],
  },
);
