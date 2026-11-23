import { defineComponent } from 'vue';
import { AnchorButton } from '../button';
import { ArrowLeftIcon } from '../icon';

export const BackToList = defineComponent(
  (props: { to: string }) => {
    return () => (
      <AnchorButton data-testid="back-to-list" to={props.to} variant="secondary">
        <ArrowLeftIcon />
        Back to list
      </AnchorButton>
    );
  },
  {
    name: 'BackToList',
    props: ['to'],
  },
);
