import { FC, useEffect, useState } from 'react';
import { AppProps } from './index.types';
import RulesWatcher from '../watchers';
import { getStorageAccessPermission } from './utils';
import jsonLogic from '../json-logic';

import { Popup, HydratedPopup } from './index.types';
import {
  BLOCK_POPUPS_ALL,
  POPUP_WAS_DISMISSED,
  SHOW_AGAIN_ATTEMPTS,
  SHOW_AGAIN_BLOCK,
} from '../constants';
import { LocalStorageManager } from '../storage-managers';
import { pushToDL } from '../utils';

const Starlight: FC<AppProps> = ({
  // After recieving popups map them, add unique id to each and use this id as param to SLonClose
  popups = [],
  rules = {},
}) => {
  const [rulesWatcher, setRW] = useState<any>(null);
  const [allPopups, setAP] = useState<HydratedPopup[]>(
    popups.map((p: Popup, i: number) => {
      const hp: HydratedPopup = {
        ...p,
        id: (p.id.match(/\w/gm) || [`SLpopup${i + 1}`]).join(''),
        SLonClose: (showAgain: boolean = false) => closePopupByid(p.id, showAgain),
      };
      return hp;
    }),
  );
  const [visiblePopup, setVisPopup] = useState<HydratedPopup | null>(null);
  const [blockedByPopup, setBlockedByPopup] = useState<boolean>(false);
  const [blockedBySameRoute, setBlockedByRoute] = useState<boolean>(false);
  const [prevUrl, setPrevUrl] = useState<string>('');
  console.log(popups, rules);

  useEffect(() => {
    getStorageAccessPermission();
    setRW(new RulesWatcher(dataUpdated));
  }, []);

  const dataUpdated = (newData: any) => {
    if (Boolean(jsonLogic.apply(rules, newData))) {
      const popupToShow = allPopups.find((popup: HydratedPopup) => {
        try {
          const now = new Date();
          let validDatePeriod = true;
          if (popup.startsAt) validDatePeriod = validDatePeriod && popup.startsAt <= now;
          if (popup.finishesAt) validDatePeriod = validDatePeriod && popup.finishesAt >= now;
          // If valid - show popup, if not - wait for next tick
          // Important: show only ONE popup at tick
          const jsonValid = jsonLogic.apply(popup.rules, newData);
          const currentRoute = newData.urls;
          const routeWasUpdated = currentRoute !== prevUrl;
          if (routeWasUpdated) {
            setPrevUrl(currentRoute);
            setBlockedByRoute(false);
          }
          return (
            popup.id !== visiblePopup?.id && jsonValid && !blockedByPopup && !blockedBySameRoute
          );
        } catch (e) {
          popup.id && removePopup(popup.id);
          return false;
        }
      });
      if (popupToShow) {
        setBlockedByPopup(true);
        beforeShow(popupToShow);
      }
    }
  };

  const beforeShow = async (popup: HydratedPopup) => {
    const { id } = popup;
    const hasAttemptsBlock = LocalStorageManager.get(`${SHOW_AGAIN_BLOCK}${id}`);
    const attemptsLeft = parseInt(LocalStorageManager.get(`${SHOW_AGAIN_ATTEMPTS}${id}`), 10);
    const blockedByBrand = !!LocalStorageManager.get(BLOCK_POPUPS_ALL);
    // isNaN(attemptsLeft) === true: this popup was never shown before, show it now
    if (!hasAttemptsBlock && (isNaN(attemptsLeft) || attemptsLeft) && !blockedByBrand) {
      setBlockedByRoute(true);
      // setContentInaccessible();
      setVisPopup(popup);
      const { showsInterval } = popup;
      if (showsInterval) {
        const expires = 1000 * 3600 * 24 * showsInterval;
        LocalStorageManager.set(BLOCK_POPUPS_ALL, true, expires);
      }
      pushToDL({ event: 'popUpVisible' });
    } else {
      setBlockedByPopup(false);
    }
  };

  const removePopup = (id: string) => {
    setAP(allPopups.filter((p: any) => p.id !== id));
  };

  const onCloseAfterSubscribe = (id: string) => {
    setVisPopup(null);
    removePopup(id);
  };

  const onDismiss = ({
    id,
    showsNumber = 1,
    showInterval = 7,
  }: {
    id: string;
    showsNumber?: number;
    showInterval?: number;
  }) => {
    setBlockedByPopup(false);
    const attemptsLeft = parseInt(LocalStorageManager.get(`${SHOW_AGAIN_ATTEMPTS}${id}`), 10);
    const attemptsLeftExpires = 1000 * 3600 * 24 * 365; // 1 year
    let showsNumberCount = 0;
    if (attemptsLeft > 0) {
      showsNumberCount = attemptsLeft - 1;
    } else if (Number.isNaN(attemptsLeft)) {
      showsNumberCount = showsNumber;
    }
    LocalStorageManager.set(`${POPUP_WAS_DISMISSED}${id}`, true, attemptsLeftExpires);
    LocalStorageManager.set(`${SHOW_AGAIN_ATTEMPTS}${id}`, showsNumberCount, attemptsLeftExpires);
    const attemptsBlockExpires = 1000 * 3600 * 24 * showInterval; // interval in days (default - 1 week)
    LocalStorageManager.set(`${SHOW_AGAIN_BLOCK}${id}`, true, attemptsBlockExpires);
    removePopup(id);
    pushToDL({ event: 'popUpClosed' });
  };

  const closePopupByid = (id: string, showAgain: boolean = false) => {
    if (showAgain) {
      onDismiss({ id });
    } else {
      onCloseAfterSubscribe(id);
    }
  };

  const renderPopup = (popup: HydratedPopup) => {
    const PopupFC = popup.popup(popup.SLonClose);
    return <PopupFC />
  } 

  return (
    <>
      {visiblePopup && renderPopup(visiblePopup)}
    </>
  );
};

export default Starlight;
