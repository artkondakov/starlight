# Starlight

Simple popup management tool

## Usage

```
import Starlight, { Popup, Rules } from '../';

const popups: Popup[] = [
  {
    rules: {
      and: [{ '>=': [{ var: 'delayForPage' }, 2] }, { '==': [{ var: 'goingToCloseWindow' }, true] }],
    },
    popup: ({ onClose }) => (
      <MyPopupFC onClose={onClose} />
    ),
    id: 'myUniquePopupID',
  }
];

const rules: Rules = { and: [{ '>=': [{ var: 'pageNumber' }, 3] }] };

...

return (<Starlight popups={popups} rules={rules} />);

```

### Available options

| Name               | Type    | Units    | Description                                                 |
| ------------------ | ------- | -------- | ----------------------------------------------------------- |
| goingToCloseWindow | boolean |          | User is moving mouse to the top of the window               |
| windowHasFocus     | boolean |          | User is in current tab                                      |
| userIsInactiveFor  | number  | seconds  | User don't clicking with mouse or pressing keys on keyboard |
| urls               | string  |          | Pathname                                                    |
| excludeUrls        | string  |          | Pathname                                                    |
| pageNumber         | number  |          | Number of route hanges during current session               |
| scroll             | number  | percents |                                                             |
| delayForPage       | number  | seconds  | Number of seconds after route was changed                   |
| delayForSession    | number  | seconds  | Number of seconds after session was started                 |
| sessionNumber      | number  |          | Number of session on your website for current user          |

### Callback options

When calling `onClose` callback you can pass up to 3 params:

| Name         | Type    | Default value | Description                                   |
| ------------ | ------- | ------------- | --------------------------------------------- |
| showAgain    | boolean | `false`       | Is popup will be shown again                  |
| showsNumber  | number  | `1`           | How many times popup will be shown again      |
| showInterval | number  | `7`           | How many days later popup will be shown again |
