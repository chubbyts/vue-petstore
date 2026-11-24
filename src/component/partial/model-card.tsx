import type { VNode } from 'vue';
import { defineComponent, useId } from 'vue';
import { AnchorButton } from '../button';
import { Card, CardBody, CardFooter } from '../card';
import { PlusIcon } from '../icon';

export type ModelCardProps = {
  icon: () => VNode;
  title: string;
  description: string;
  count?: number;
  countLabel: (count: number) => string;
  listTo: string;
  createTo?: string;
  createLabel: string;
};

// attributes (e.g. data-testid) go to the card
export const ModelCard = defineComponent(
  (props: ModelCardProps) => {
    const titleId = useId();

    return () => (
      <Card aria-labelledby={titleId}>
        <CardBody>
          <div class="flex items-center gap-3">
            <span class="bg-nav-active text-link-hover rounded-control flex size-10 shrink-0 items-center justify-center">
              {props.icon()}
            </span>
            <h2 id={titleId} class="m-0 min-w-0 text-lg font-semibold">
              {props.title}
            </h2>
          </div>
          <p class="text-fg-muted m-0">{props.description}</p>
          <p class="m-0 flex items-baseline gap-2">
            <strong class="text-[26px] font-bold tracking-[-0.01em]">{props.count ?? '—'}</strong>
            {props.count !== undefined ? <span class="text-fg-muted">{props.countLabel(props.count)}</span> : null}
          </p>
        </CardBody>
        <CardFooter>
          <AnchorButton
            aria-label={`View all ${props.title.toLowerCase()}`}
            to={props.listTo}
            variant="secondary"
            size="sm"
          >
            View all
          </AnchorButton>
          {props.createTo ? (
            <AnchorButton to={props.createTo} variant="primary" size="sm">
              <PlusIcon strokeWidth={2.2} />
              {props.createLabel}
            </AnchorButton>
          ) : null}
        </CardFooter>
      </Card>
    );
  },
  {
    name: 'ModelCard',
    props: ['icon', 'title', 'description', 'count', 'countLabel', 'listTo', 'createTo', 'createLabel'],
  },
);
