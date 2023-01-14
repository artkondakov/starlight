import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './popups';
// @ts-ignore
import Starlight from '../dist';

const popups = [
  {
    rules: {
      and: [{ '>=': [{ var: 'pageNumber' }, 1] }, { '==': [{ var: 'goingToCloseWindow' }, true] }],
    },
    popup: (onClose: any) => (
      <Popup title='Popup #1' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
  },
  {
    rules: { and: [{ '==': [{ var: 'pageNumber' }, 1] }] },
    popup: (onClose: any) => (
      <Popup title='Popup #2' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
  },
  {
    rules: {
      and: [
        { UrlRegExp: [{ var: 'urls' }, '/ok'] },
        { NotUrlRegExp: [{ var: 'excludeUrls' }, '/forbidden'] },
        { '>=': [{ var: 'pageNumber' }, 3] },
        { '>=': [{ var: 'scroll' }, 50] },
        { '>=': [{ var: 'delayForPage' }, 2] },
        { '>=': [{ var: 'delayForSession' }, 3] },
        { '>=': [{ var: 'timeoutAfterAgreeConsent' }, 2] },
        { '==': [{ var: 'source' }, 'facebook'] },
        { '==': [{ var: 'subscribed' }, true] },
      ],
    },
    popup: (onClose: any) => (
      <Popup title='Popup #3' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
  },
];

export default (() => {
  const root = createRoot(document.querySelector('#starlight') as Element);
  root.render(<Starlight>{popups}</Starlight>);
})();
