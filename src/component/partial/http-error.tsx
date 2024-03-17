import { defineComponent } from 'vue';
import type { HttpError as HttpErrorType } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

export const HttpError = defineComponent(
  (props: { httpError: HttpErrorType }) => {
    return () => (
      <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
        <p class="font-bold">{props.httpError.title}</p>
        {props.httpError.detail ? <p>{props.httpError.detail}</p> : null}
        {props.httpError.instance ? <p>{props.httpError.instance}</p> : null}
        {props.httpError instanceof BadRequestOrUnprocessableEntity && props.httpError.invalidParameters?.length ? (
          <ul>
            {props.httpError.invalidParameters.map((invalidParameter, i) => (
              <li key={i}>
                <strong>{invalidParameter.name}</strong>: {invalidParameter.reason}
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
