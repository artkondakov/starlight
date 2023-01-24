import jsonLogic from "json-logic";
import React from "react";

export type rules = jsonLogic.RulesLogic<jsonLogic.AdditionalOperation>;

export interface PopupProps {
  onClose: (options: onCloseOptions) => void;
}

export interface onCloseOptions {
  showsNumber?: number;
  showInterval?: number;
  showAgain?: boolean;
}

export interface Popup {
  rules: rules;
  popup: React.FC<PopupProps>,
  id: string;
  
  startsAt?: Date | string;
  finishesAt?: Date | string;
  showsNumber?: number;
  showsInterval?: number;
}

export interface HydratedPopup extends Popup, PopupProps {}

export interface AppProps {
  popups: Popup[];
  rules?: rules;
}
