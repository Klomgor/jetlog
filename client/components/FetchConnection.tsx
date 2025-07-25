import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '../components/Elements'
import API from '../api';
import { Flight } from '../models';

interface FetchConnectionProps {
    name: string;
    date: string;
    origin: string|undefined;
    destination: string|undefined;
    value?: number;
    onFetched?: (c: number) => void;
}

export default function FetchConnection({ name, date, origin, destination, value, onFetched }: FetchConnectionProps) {
    const [searched, setSearched] = useState<boolean>(false);
    const [connectionFlight, setConnectionFlight] = useState<Flight>(); // only needed for printing flight info

    // if value is initially set, we must
    // find matching flight (only first render)
    useEffect(() => {
        if (value) {
            API.get(`flights?id=${value}`)
            .then((data: Flight) => { setConnectionFlight(data) });
        }
    }, [])

    // whenever origin or destination or date is changed,
    // we can search again
    useEffect(() => {
        setSearched(false);
    }, [date, origin, destination]);

    // this method returns an actual instance of 
    // Flight so that its class methods can be used
    const createInstance = (obj) => {
        let correct: Flight = new Flight();
        Object.assign(correct, obj);

        return correct;
    }

    const searchConnection = () => {
        // connection flight must be within 2 days after
        // and 1 day before the actual flight, and should
        // have origin where actual flight has destination,
        // and destination != actual flight origin
        const start = new Date(date);
        start.setDate(start.getDate() - 1);

        const end = new Date(date);
        end.setDate(end.getDate() + 2);

        const fmt = d => d.toISOString().substring(0, 10);

        API.get(`/flights?start=${fmt(start)}&end=${fmt(end)}&origin=${destination}`)
        .then((data: Flight[]) => {
            if (!onFetched) return; // only keep going if we have to do something

            // only keep results where connection flight destination != actual flight origin,
            // so that quick trips aren't counted as a connection back and forth
            data = data.filter((flight: Flight) => flight.destination.icao != origin)

            if (data.length > 1) {
                // this should be very rare, for now we handle it
                // with a crude prompt
                const choice = prompt(`Multiple possible connections found, select one by entering its number:
                                          ${ data.map((f: Flight, i) => `\n[${i}] ${createInstance(f).toString()}`) }`);

                if (!choice) {
                    alert("Your input must be a valid index!");
                    return;
                }

                const parsed = Number.parseInt(choice);

                if (!Number.isInteger(parsed) || parsed < 0 || parsed > data.length - 1) {
                    alert("Your input must be a valid index!");
                    return;
                }

                const connection: Flight = data[choice];
                setConnectionFlight(connection);
                onFetched(connection.id);
            } else if (data.length == 1) {
                const connection: Flight = data[0];
                setConnectionFlight(connection);
                onFetched(connection.id);
            }

            setSearched(true);
        });
    }

    return (
    <>
        { !searched &&
            <Button
                text="Fetch"
                disabled={destination === undefined}
                onClick={searchConnection}
            />
        }

        <input type="hidden" name={name} value={value}/>

        { connectionFlight ?
            <p>{createInstance(connectionFlight).toString()}</p>
            :
            searched &&
            <p>No results!</p>
        }
    </>
    );
}
