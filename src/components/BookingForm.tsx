import React, { useState } from "react";
import "./BookingForm.css";
import FieldTable from "./FieldTable";



interface Props {
  onCancel: () => void;
  // onDateClick: (date: Date) => void;
   selectedDate: Date | null;
   setSelectedDate: (date: Date | null) => void; 
}
interface FieldData {
  idField: number;
  name: string;
  isBooked: boolean;
  chosenDate: Date | null;
}
const initialFields1: FieldData[] = [
  { idField: 1, name: "Förmiddag", isBooked: false, chosenDate: null },
  { idField: 2, name: "Eftermiddag", isBooked: false, chosenDate: null },
  { idField: 3, name: "Kväll", isBooked: false, chosenDate: null },
];

const initialFields2: FieldData[] = [
  { idField: 1, name: "Förmiddag", isBooked: false, chosenDate: null },
  { idField: 2, name: "Eftermiddag", isBooked: false,chosenDate: null },
  { idField: 3, name: "Kväll", isBooked: false, chosenDate: null },
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
            field.idField === fieldId
              ? { ...field, isBooked: true, chosenDate: localSelectedDate }
              : field
          )
        );
      } else {
        setFields2(prevFields =>
          prevFields.map(field =>
            field.idField === fieldId
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
    

  // useEffect(() => {
  //   fetchData(setSelectedDate);
  // }, [setSelectedDate]);

 

  const handleBook = async () => {
    try {
      const allFields = [...fields1, ...fields2];
      const bookingData = {
        bookings: allFields,
      };
    
      let selectedDatePlusOneDay: Date | null = null;
      if (selectedDate) {
        selectedDatePlusOneDay = new Date(selectedDate);
        selectedDatePlusOneDay.setDate(selectedDatePlusOneDay.getDate() + 1); // Add one day
      }
  
     
      console.log('bookingDataArray:', bookingData);
      const response = await fetch('http://localhost:8080/bookings', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify([bookingData]),
        
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

  return (
    <>
    <div className="bookingForm">
      <h1>Boka</h1>
     
      <div className="tableContainer">
        <div className="tableBackground1">
        <h2>Varm</h2>
        <FieldTable fields={fields1} handleFieldClick={(fieldId) => handleFieldClick(fieldId, true)} isTable1={true} />
        </div>
        <div >
        <button className="theButtons" onClick={handleBook}>Boka</button>
        <button className="theButtons" onClick={onCancel}>Avbryt</button>
        </div>
      <div className="tableBackground2">
      <h2>Kall</h2>
   <FieldTable fields={fields2} handleFieldClick={(fieldId) => handleFieldClick(fieldId, false)} isTable1={false} />
      </div>
   
      </div>
    </div>
    </>
   
  );
};

export default BookingForm;