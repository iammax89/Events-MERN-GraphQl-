import React, { FC, useContext, Fragment, useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import myClasses from "./Events.module.scss";
import Modal from "../../common/Modal/Modal";
import Context from "../../context/context";
import { EventForm } from "../components/event-from/EventForm";
import { FetchedEvent } from "../../models/event";
import EventsTable from "../components/events-table/EventsTable";
import EventDetails from "../components/event-details/EventDetails";

const EventPage: FC = () => {
  const { openModal, token } = useContext(Context);
  const [events, setEvents] = useState<FetchedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEvent, setModalEvent] = useState<FetchedEvent | null>();
  useEffect(() => fetchEvents(), []);

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `query {
        events {
          _id
          title
          describtion
          date
          price
          creator {
            _id
          }
        }
      }
      `,
    };
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((data) => data["data"]["events"])
      .then((events: FetchedEvent[]) => {
        console.log(events);
        setIsLoading(false);
        setEvents(events);
      })
      .catch((err) => console.log(err));
  };
  const eventDetailsHandler = (id: string) => {
    const event = events.find((e) => e._id === id);
    if (event) {
      setModalEvent(event);
    }
    openModal();
  };
  const createEventHandler = () => {
    setModalEvent(null);
    openModal();
  };
  return (
    <Fragment>
      {" "}
      {token && (
        <div className={myClasses.eventsControl}>
          <p>Add your own events:</p>
          <Button
            color="secondary"
            variant="contained"
            onClick={createEventHandler}
          >
            Create Event
          </Button>
          {!modalEvent && (
            <Modal title="Add Event">
              <EventForm canCancel canConfirm fetchEvents={fetchEvents} />
            </Modal>
          )}
        </div>
      )}
      <EventsTable
        events={events}
        isLoading={isLoading}
        viewDetail={eventDetailsHandler}
      />
      {modalEvent && (
        <Modal title={`${modalEvent.title}`}>
          <EventDetails
            describtion={modalEvent.describtion}
            id={modalEvent._id}
          />
        </Modal>
      )}
    </Fragment>
  );
};
export default EventPage;
