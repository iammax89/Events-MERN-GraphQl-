import { Reducer } from "react";
import { Moment } from "moment";

interface State {
  title: {
    value: string;
    isValid: boolean;
  };
  price: {
    value: string;
    isValid: boolean;
  };
  date: {
    value: Moment;
    isValid: boolean;
  };
  describtion: {
    value: string;
    isValid: boolean;
  };
}

type Action =
  | {
      type: "INPUT_CHANGE";
      payload: {
        inputId: string;
        isValid: boolean;
        value: string | null | Moment;
      };
    }
  | {
      type: "CLEAR_FORM";
      payload: {
        title: {
          value: string;
          isValid: boolean;
        };
        price: {
          value: string;
          isValid: boolean;
        };
        date: {
          value: Moment;
          isValid: boolean;
        };
        describtion: {
          value: string;
          isValid: boolean;
        };
      };
    };

export const eventFormReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.payload.inputId]: {
          value: action.payload.value,
          isValid: action.payload.isValid,
        },
      };
    case "CLEAR_FORM":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
