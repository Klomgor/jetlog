import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { Flight } from '../models'
import API from '../api'

function TableCell({ text }) {
    return (
        <td className="px-2 py-1 border border-gray-300">
            {text}
        </td>
    );
}

function TableHeading({ text }) {
    return (
        <th className="px-2 border border-gray-300 bg-primary-300 font-semibold">
            {text}
        </th>
    );
}

//TODO UI elements to make use of query flights
export default function FlightsTable({ filters }) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/flights", filters)
        .then((data) => {
            setFlights(data);
        });
    }, [filters]);

    if(flights === null) {
        return (
            <p>Loading...</p>
        );
    }
    else if (flights.length === 0) {
        return (
            <p>No flights!</p>
        );
    }

    const handleRowClick = (flightID: number) => {
        navigate(`/flights?id=${flightID}`);
    }

    return (
        <div className="overflow-x-auto">
        <table className="table-auto w-full">
            <tr>
                <TableHeading text="Date"/>
                <TableHeading text="Origin"/>
                <TableHeading text="Destination"/>
                <TableHeading text="Departure Time"/>
                <TableHeading text="Arrival Time"/>
                <TableHeading text="Duration"/>
                <TableHeading text="Distance"/>
                <TableHeading text="Seat"/>
                <TableHeading text="Airplane"/>
            </tr>
            { flights.map((flight: Flight) => (
            <tr className="cursor-pointer even:bg-gray-100 hover:bg-gray-200 duration-75" 
                onClick={() => handleRowClick(flight.id)}>
                <TableCell text={flight.date}/>
                <TableCell text={flight.origin.city + '(' + (flight.origin.iata || flight.origin.icao) + ')'}/>
                <TableCell text={flight.destination.city + '(' + (flight.destination.iata || flight.destination.icao) + ')'} />
                <TableCell text={flight.departureTime || "N/A"}/>
                <TableCell text={flight.arrivalTime || "N/A"}/>
                <TableCell text={flight.duration ? flight.duration + " min" : "N/A"}/>
                <TableCell text={flight.distance ? flight.distance.toLocaleString() + " km" : "N/A"}/>
                <TableCell text={flight.seat || "N/A"}/>
                <TableCell text={flight.airplane || "N/A"}/>
            </tr>
            ))}
        </table>
        </div>
    );
}