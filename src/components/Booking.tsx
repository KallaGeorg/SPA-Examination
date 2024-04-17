import React, { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import BookingForm from './BookingForm';

interface Day {
    flaggdag: string;
    veckodag: string;
    datum: string;
    helgdag: string;
    'arbetsfri dag': string;
}
interface FieldData {
    id: number;
    name: string;
    isBooked: boolean;
  }
  const initialFields1: FieldData[] = [
    { id: 1, name: "Förmiddag", isBooked: false },
    { id: 2, name: "Eftermiddag", isBooked: false },
    { id: 3, name: "Kväll", isBooked: false },
  ];

  const initialFields2: FieldData[] = [
    { id: 1, name: "Förmiddag", isBooked: false },
    { id: 2, name: "Eftermiddag", isBooked: false },
    { id: 3, name: "Kväll", isBooked: false },
  ];
const yearsToFetch = [2024, 2025]; 
function Booking() {
    const [nonBookableDays, setNonBookableDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ fields1, setFields1] = useState<FieldData[]>(initialFields1); // Define initialFields1 here
  const [ fields2,setFields2] = useState<FieldData[]>(initialFields2); // Define initialFields2 here

  // Define initial fields data
 

  // Rest of your component code...

    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        const fetchNonBookableDays = async () => {
            const allNonBookableDates: Date[] = [];
            for (const year of yearsToFetch) {
                const response = await fetch(`http://sholiday.faboul.se/dagar/v2.1/${year}`);
                const data: { dagar: Day[] } = await response.json();
              
                

const isNonBookableDay = (day: Day) => {
    if (day['helgdag']) {
        return true; 
    }
    if (day['veckodag'] === 'Måndag') {
        return true; 
    }
    return false; 
};


    const nonBookableDates = data.dagar.filter(day => isNonBookableDay(day)).map(day => {
    const [year, month] = day.datum.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, parseInt(day.datum.split("-")[2]))); 
});


    
                allNonBookableDates.push(...nonBookableDates);
            }
    
            setNonBookableDays(allNonBookableDates);
        };
    
        fetchNonBookableDays();
    }, []);
    
     const handleDateClick = (date: Date) =>{
        console.log("Date clicked:", date);
        setSelectedDate(date);
     }
     useEffect(() => {
        // Call handleDateLogout when selectedDate changes and is null
        if (selectedDate === null) {
          handleDateLogout();
        }
      }, [selectedDate]);
    
      const handleDateLogout = () => {
        console.log("HandleDatelogout called...");
        // Reset fields1 and fields2 to their initial unbooked state
        setFields1(initialFields1);
        setFields2(initialFields2);
        // Clear the selectedDate state
        setSelectedDate(null);
      };
    return (
        <div className="dropdown">
        <button className="dropbtn">Bokning</button>
        <div className="dropdown-content">
            {/* <h1>Boka tid</h1> */}
            <button className="dropbtn">Bokning</button>
            <div className="dropdown-content">
                
                <h1 className='bookingHeader'>Boka tid</h1>
                
                <Calendar 
                 className={"calendar"}
                 tileDisabled={({ date }) =>
                 nonBookableDays.some(
                 (nonBookableDate) => {
                const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                const utcNonBookableDate = new Date(Date.UTC(nonBookableDate.getFullYear(), nonBookableDate.getMonth(), nonBookableDate.getDate()));
                return utcNonBookableDate.getTime() === utcDate.getTime();
            }
        )
    }
    onClickDay={(date)=> handleDateClick(date)}
    
/>

                {selectedDate && (
                    <div className='bookingForm'>
                        <h2>Bokning för {selectedDate.toDateString()}</h2>
                        <BookingForm onCancel={() => setSelectedDate(null)}  selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                    </div>
                    
                )}

                
            </div>
        </div>
      </div>
    );
}


export default Booking;