import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popup1, Popup2 } from './popups';
import Starlight, { Popup as PopupType, rules } from '../';

const popups: PopupType[] = [
  {
    rules: {
      and: [{ '>=': [{ var: 'pageNumber' }, 1] }, { '==': [{ var: 'goingToCloseWindow' }, true] }],
    },
    popup: ({ onClose }) => (
      <Popup1 title='Popup #1' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
    id: 'popup1',
  },
  {
    rules: { and: [{ '>=': [{ var: 'pageNumber' }, 1] }] },
    popup: ({ onClose }) => (
      <Popup2 title='Popup #2' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
    id: '1337',
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
    popup: ({ onClose }) => (
      <Popup1 title='Popup #3' text='Lorem ipsum' button='Click me!' onClose={onClose} />
    ),
    id: '_-=Nagibator9000=-_',
  },
];

const rules: rules = { and: [{ '>=': [{ var: 'pageNumber' }, 15] }] };

const root = createRoot(document.querySelector('#starlight') as Element);

root.render(<><Starlight popups={popups} rules={rules} /></>);
