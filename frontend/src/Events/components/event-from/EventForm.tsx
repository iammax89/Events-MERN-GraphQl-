import "date-fns";
import React, { FC, useReducer, FormEvent, useContext } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  TextField,
  Button,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment, { Moment, isMoment } from "moment";
import myClasses from "./EventForm.module.scss";
import { eventFormReducer } from "./eventFormReducer";
import Context from "../../../context/context";
import { IEventInput } from "../../../models/event";

interface eventFormProps {
  canCancel: boolean;
  canConfirm: boolean;
  fetchEvents: () => void;
}
export const EventForm: FC<eventFormProps> = ({
  canCancel,
  canConfirm,
  fetchEvents,
}) => {
  const { token, closeModal } = useContext(Context);
  const [formState, dispacth] = useReducer(eventFormReducer, {
    title: {
      value: "",
      isValid: true,
    },
    price: {
      value: "",
      isValid: true,
    },
    date: {
      value: moment(),
      isValid: true,
    },
    describtion: {
      value: "",
      isValid: true,
    },
  });
  const validator = (
    inputId: string,
    value: Moment | null | string
  ): boolean => {
    switch (inputId) {
      case "title":
        return typeof value === "string" && value.length > 0;
      case "price":
        return value !== null && +value > 0;
      case "date":
        return isMoment(value);
      case "describtion":
        return typeof value === "string" && value.length > 5;
      default:
        return true;
    }
  };
  const handleInputChange = (
    value: Moment | null | string,
    inputId: string
  ) => {
    dispacth({
      type: "INPUT_CHANGE",
      payload: {
        inputId,
        value,
        isValid: validator(inputId, value),
      },
    });
  };
  const onSubmitHadler = (event: FormEvent) => {
    event.preventDefault();
    const eventData: IEventInput = {
      title: formState.title.value,
      describtion: formState.describtion.value,
      price: +formState.price.value,
      date: formState.date.value?.format(),
    };
    const requestBody = {
      query: `mutation CreateEvent(
        $title: String!,
         $describtion: String!,
          $date: String!,
           $price: Float!) {
          createEvent(eventInput: {
          title: $title
          describtion: $describtion
          date: $date
          price: $price}) {
            _id
            title
            describtion
            price
            date
          }
        }`,
      variables: {
        title: eventData.title,
        describtion: eventData.describtion,
        date: eventData.date,
        price: eventData.price,
      },
    };
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          throw new Error("Failed!");
        }
        fetchEvents();
        closeModal();
        dispacth({
          type: "CLEAR_FORM",
          payload: {
            title: {
              value: "",
              isValid: true,
            },
            price: {
              value: "",
              isValid: true,
            },
            date: {
              value: moment(),
              isValid: true,
            },
            describtion: {
              value: "",
              isValid: true,
            },
          },
        });
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  return (
    <form className={myClasses.eventForm} onSubmit={onSubmitHadler}>
      <FormControl
        className={myClasses.eventFormControl}
        error={!formState.title.isValid}
      >
        <InputLabel htmlFor="title">Title</InputLabel>
        <Input
          id="title"
          type="text"
          value={formState.title.value}
          onChange={(event) => handleInputChange(event.target.value, "title")}
        />
      </FormControl>
      <FormControl
        className={myClasses.eventFormControl}
        error={!formState.price.isValid}
      >
        <InputLabel htmlFor="price">Price $</InputLabel>
        <Input
          id="price"
          type="number"
          value={formState.price.value}
          onChange={(event) => handleInputChange(event.target.value, "price")}
        />
      </FormControl>

      <FormControl className={myClasses.eventFormControl}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            error={!formState.date.isValid}
            label="Date"
            id="date"
            clearable
            value={formState.date.value}
            onChange={(date) => handleInputChange(date, "date")}
            minDate={new Date()}
            format="DD/MMM/yyyy"
          />
        </MuiPickersUtilsProvider>
      </FormControl>
      <FormControl className={myClasses.eventFormControl}>
        <TextField
          error={!formState.describtion.isValid}
          id="outlined-multiline-static"
          label="Describtion"
          multiline
          rows={3}
          value={formState.describtion.value}
          onChange={(event) =>
            handleInputChange(event.target.value, "describtion")
          }
        />
      </FormControl>
      <div className={myClasses.buttonContainer}>
        {canCancel && (
          <Button variant="outlined" color="primary" onClick={closeModal}>
            Cancel
          </Button>
        )}
        {canConfirm && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              !formState.title.value.length ||
              !formState.title.isValid ||
              !formState.describtion.value.length ||
              !formState.describtion.isValid ||
              !formState.date.isValid ||
              !formState.price.isValid
            }
          >
            Confirm
          </Button>
        )}
      </div>
    </form>
  );
};
