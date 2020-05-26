import React, { FC, useContext, useState } from "react";
import myClasses from "./EventDetails.module.scss";
import { Button } from "@material-ui/core";
import Context from "../../../context/context";

interface EventDetailsProps {
  describtion: string;
  id: string;
}
const EventDetails: FC<EventDetailsProps> = ({ describtion, id }) => {
  const { closeModal, token } = useContext(Context);
  const [isLoading, setIsloading] = useState(false);

  const bookEventHandler = (id: string) => {
    if (!token) {
      closeModal();
      return;
    }
    setIsloading(true);
    const requestBody = {
      query: `mutation BookEvent($id: ID!){
        bookEvent(eventId: $id) {
          _id
          createdAt
          updatedAt
        }
      }`,
      variables: {
        id,
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
        return res.json();
      })
      .then((data) => data["data"]["bookEvent"])
      .then((event) => {
        setIsloading(false);
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={myClasses.container}>
      <p>{describtion}</p>
      <div className={myClasses.buttonContainer}>
        <Button variant="outlined" color="primary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isLoading}
          onClick={() => bookEventHandler(id)}
        >
          {token ? "Book" : "Confirm"}
        </Button>
      </div>
    </div>
  );
};
export default EventDetails;
