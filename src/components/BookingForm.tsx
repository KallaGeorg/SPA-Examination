import React, { useEffect, useState } from "react";
import "./BookingForm.css";
import FieldTable from "./FieldTable";



interface Props {
  onCancel: () => void;
  // onDateClick: (date: Date) => void;
   selectedDate: Date | null;
   setSelectedDate: (date: Date | null) => void; 
}
interface FieldData {
  id: number;
  name: string;
  isBooked: boolean;
  chosenDate?: Date | null;
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


const BookingForm: React.FC<Props> = ({ onCancel, selectedDate, setSelectedDate }) => {
  
    const [fields1, setFields1] = useState(initialFields1);
    const [fields2, setFields2] = useState(initialFields2);
    

    const handleFieldClick = (fieldId: number, isTable1: boolean) => {
      // Create a copy of the current selectedDate
      const localSelectedDate = selectedDate !== null ? new Date(selectedDate) : null;
      console.log("HandleFieldClick....");
      console.log("newchosendate", localSelectedDate);
      // Add one day to the chosenDate if it exists
      if (localSelectedDate) {
        localSelectedDate.setDate(localSelectedDate.getDate() + 1);
        console.log("newchosendate.................");
      }
    
      // Update the state of fields1 or fields2 based on the isTable1 parameter
      if (isTable1) {
        setFields1(prevFields =>
          prevFields.map(field =>
            field.id === fieldId
              ? { ...field, isBooked: true, chosenDate: localSelectedDate }
              : field
          )
        );
      } else {
        setFields2(prevFields =>
          prevFields.map(field =>
            field.id === fieldId
              ? { ...field, isBooked: true, chosenDate: localSelectedDate }
              : field
          )
        );
      }
    
      console.log("Value of selectedDate:", selectedDate);
      // Call handleDateLogout if the selected date is null
      if (selectedDate === null) {
        setSelectedDate(localSelectedDate);
      }
    };
    

  useEffect(() => {
    fetchData(setSelectedDate);
  }, [setSelectedDate]);

 

  const handleBook = async () => {
    try {
      const allFields = [...fields1, ...fields2];
      
      // Create a new Date object with the selectedDate
      let selectedDatePlusOneDay: Date | null = null;
      if (selectedDate) {
        selectedDatePlusOneDay = new Date(selectedDate);
        selectedDatePlusOneDay.setDate(selectedDatePlusOneDay.getDate() + 1); // Add one day
      }
  
      const bookingData = {
        bookingState: allFields,
        selectedDate: selectedDatePlusOneDay, // Use the updated selectedDate
      };
      console.log('bookingData:', bookingData);
      const response = await fetch('http://localhost:3000/bookings', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      if (response.ok) {
        console.log('Booking successful!');
      } else {
        console.error("Failed to book.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const fetchData = async (setSelectedDate: (date: Date) => void)=> {
    try {
      const response = await fetch("http://localhost:3000/bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch booking data");
      }
      const data = await response.json();

      if (data[0] && data[0].bookingState) {
        const bookingState = data[0].bookingState;
        const newSelectedDate = new Date(data[0].selectedDate); 
        setFields1(bookingState.slice(0, 3));
        setFields2(bookingState.slice(3));
        setSelectedDate(newSelectedDate);
      } else {
        console.error("Booking state data not found");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };


  return (
    <>
    <div className="bookingForm">
      <h1>Boka</h1>
     
      <div className="tableContainer">
        <div className="tableBackground1">
        <h2>Varm</h2>
        
        <FieldTable fields={fields1} handleFieldClick={(fieldId) => handleFieldClick(fieldId, true)} isTable1={true} />
          
        </div>
      <div className="tableBackground2">
      <h2>Kall</h2>
      
   <FieldTable fields={fields2} handleFieldClick={(fieldId) => handleFieldClick(fieldId, false)} isTable1={false} />
        
      
        
      </div>
      </div>
    </div>
    <button onClick={handleBook}>Boka</button>
     <button onClick={onCancel}>Avbryt</button>
    </>
   
  );
};

export default BookingForm;