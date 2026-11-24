import type { HTMLAttributes } from 'vue';
import { defineComponent } from 'vue';
import type { HttpError as HttpErrorType } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

// attributes (e.g. tabindex, to move the focus to it) go to the alert
export const HttpError = defineComponent(
  (props: HTMLAttributes & { httpError: HttpErrorType }) => {
    return () => (
      <div
        role="alert"
        data-testid="http-error"
        class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
      >
        <p class="m-0">
          <strong class="text-danger">
            {props.httpError.status ? `${props.httpError.status} ${props.httpError.title}` : props.httpError.title}
          </strong>
        </p>
        {props.httpError.detail ? <p class="m-0">{props.httpError.detail}</p> : null}
        {props.httpError.instance ? <p class="m-0 font-mono text-[13px]">{props.httpError.instance}</p> : null}
        {props.httpError instanceof BadRequestOrUnprocessableEntity && props.httpError.invalidParameters?.length ? (
          <ul class="m-0 list-none p-0">
            {props.httpError.invalidParameters.map((invalidParameter, i) => (
              <li key={i}>
                <strong class="text-danger font-semibold">{invalidParameter.name}</strong>: {invalidParameter.reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
  {
    name: 'HttpError',
    props: ['httpError'],
  },
);
