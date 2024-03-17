/** @jsxImportSource vue */

import { render } from '@testing-library/vue';
import Home from '../../../src/component/page/home';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';

test('default', () => {
  const { container } = render(<Home />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><h1 class="mb-4 border-b pb-2 text-4xl font-black">Home</h1></div>
    </div>
    "
  `);
});
