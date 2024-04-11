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
const yearsToFetch = [2024, 2025]; 
function Booking() {
    const [nonBookableDays, setNonBookableDays] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        const fetchNonBookableDays = async () => {
            const allNonBookableDates: Date[] = [];
            for (const year of yearsToFetch) {
                const response = await fetch(`http://sholiday.faboul.se/dagar/v2.1/${year}`);
                const data: { dagar: Day[] } = await response.json();
                console.log("Data,", data);
                
       // Funktion för att kontrollera om en dag är en helgdag eller måndag
const isNonBookableDay = (day: Day) => {
    if (day['helgdag']) {
        return true; // Om det är en helgdag, returnera true
    }
    if (day['veckodag'] === 'Måndag') {
        return true; // Om det är måndag, returnera true
    }
    return false; // Annars, returnera false
};

// Filtera ut endast de dagar som är helgdagar eller måndagar
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
        setSelectedDate(date);
     }
     
    return (
        <div className="dropdown">
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
                        <BookingForm onCancel={()=> setSelectedDate(null)} />
                    </div>
                    
                )}

                
            </div>
        </div>
    );
}
export default Booking;