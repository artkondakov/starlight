import jsonLogic from "json-logic";
import React from "react";

export type onCloseCallback = (showAgain: boolean) => any;

export interface Popup {
  rules: jsonLogic.RulesLogic<jsonLogic.AdditionalOperation>;
  popup: (onClose: onCloseCallback) => React.FunctionComponent<any>;
  id: string;
  
  startsAt?: Date | string;
  finishesAt?: Date | string;
  showsNumber?: number;
  showsInterval?: number;
}

export interface HydratedPopup extends Popup {
  SLonClose: (showAgain: boolean) => any;
}

export interface AppProps {
  popups?: Popup[];
  rules?: jsonLogic.RulesLogic<jsonLogic.AdditionalOperation>;
}