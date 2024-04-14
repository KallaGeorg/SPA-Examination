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
const yearsToFetch = [2024, 2025]; 
function Booking() {
    const [nonBookableDays, setNonBookableDays] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [fieldStates, setFieldStates] = useState<{ [date: string]: FieldData[] }>({});
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

// Filtera ut endast de dagar som är helgdagar eller måndagar
    const nonBookableDates = data.dagar.filter(day => isNonBookableDay(day)).map(day => {
    const [year, month, dayOfMonth] = day.datum.split("-").map(Number); 
    return new Date(year, month - 1, dayOfMonth);
});


    
                allNonBookableDates.push(...nonBookableDates);
            }
    
            setNonBookableDays(allNonBookableDates);
        };
    
        fetchNonBookableDays();
    }, []);
    
    const handleDateClick = (date: Date) => {
        setSelectedDate(date); 
    };
 
    const handleFieldStates = (date: string, states: FieldData[]) => {
        setFieldStates(prevStates => ({
            ...prevStates,
            [date]: states
        }));
    };
    return (
        <div className="dropdown">
            <button className="dropbtn">Bokning</button>
            <div className="dropdown-content">
                <h1 className='bookingHeader'>Boka tid</h1>
                    <Calendar 
                    className={"calendar"}
                    tileDisabled={({ date }) =>
                        nonBookableDays.some(nonBookableDate => date.getTime() === nonBookableDate.getTime())
                    }
                    onClickDay={handleDateClick}
                />
                {selectedDate && (
                    <div className='bookingForm'>
                      
                        <BookingForm
                         selectedDate={selectedDate}
                         fieldStates ={fieldStates[selectedDate.toISOString()] || [] }  
                         onCancel={()=> setSelectedDate(null)} 
                         getFieldStates={(states) => handleFieldStates(selectedDate.toISOString(), states)}
                         initialFieldStates={{ [selectedDate.toISOString()]: fieldStates[selectedDate.toISOString()] || [] }}
                          />
                    </div>
                
                    
                )}

                
            </div>
        </div>
    );
}
export default Booking;




