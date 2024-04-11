import React, { useEffect, useState } from "react";
import "./BookingForm.css";
import FieldTable from "./FieldTable";
import CredentialForm from "./CredentialForm";


interface Props {
  onCancel: () => void;
}

const BookingForm: React.FC<Props> = ({ onCancel }) => {
  const [fields1, setFields1] = useState([
    { id: 1, name: "Förmiddag", isBooked: false },
    { id: 2, name: "Eftermiddag", isBooked: false },
    { id: 3, name: "Kväll", isBooked: false },
    
  ]);
  const [fields2, setFields2] = useState([
    { id: 1, name: "Förmiddag", isBooked: false },
    { id: 2, name: "Eftermiddag", isBooked: false },
    { id: 3, name: "Kväll", isBooked: false },
    
  ]);
  const [formData, setFormData] = useState<{ name: string; email: string }>({ name: '', email: '' });

  // const handleCredentialSave = async (formData: {name:string; email: string}) =>{
  //   try{
  //       const response = await fetch("http://localhost:3000/users",{ 
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body:JSON.stringify(formData),
  //   });
  //   if(response.ok){
  //       console.log("Userdata successfully saved!");
  //   }else{
  //       console.log("Dålig kod User-data inte sparad.");
  //   }
  //   }catch(error){
  //       console.error('Error:',error);
  //   }
  // };

  const handleBook = async () =>{
    try{
    const allFields = [...fields1, ...fields2];

    const bookingData = {
      userCredentials: formData,
      bookingState: allFields,
    };
    const response = await fetch('http://localhost:3000/bookings',{
      method:"POST",
      headers: {
        "Content-Type":"appliction/json",
      },
      body:JSON.stringify(bookingData),
      
    });

    if(response.ok){
      console.log('Booking successful!');
    }else{
      console.error("Failed to book.");
    }
    }catch(error){
      console.error("Error:",error);
    }
  };
  const fetchData = async () =>{
    try{
      const response = await fetch("http://localhost:3000/bookings");
      if(!response.ok){
        throw new Error("Failed to fetch booking data");
      }
      const data = await response.json();

      const userCredentials = data.userCredentials;
      const bookingState = data.bookingState;

      setFields1(bookingState.slice(0,3));
      setFields2(bookingState.slice(3));
      setFormData(userCredentials);
    }catch (error){
      console.error("Error", error);
    }
  };
 useEffect(() => {
  fetchData();
 }, []);
  const handleFieldClick1 = (fieldId: number) => {
    setFields1((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, isBooked: !field.isBooked } : field
      )
    );
  };
  const handleFieldClick2 = (fieldId: number) => {
    setFields2((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, isBooked: !field.isBooked } : field
      )
    );
  };


  return (
    <>
    <div className="bookingForm">
      <h1>Dina uppgifter</h1>
      <CredentialForm setFormData={setFormData} />
      <div className="tableContainer">
        <div className="tableBackground1">
        <h2>Varm</h2>
      <FieldTable fields={fields1} onFieldClick={handleFieldClick1} />
        </div>
      <div className="tableBackground2">
      <h2>Kall</h2>
      <FieldTable fields={fields2} onFieldClick={handleFieldClick2} />
      </div>
      </div>
    </div>
    <button onClick={handleBook}>Boka</button>
     <button onClick={onCancel}>Avbryt</button>
    </>
   
  );
};

export default BookingForm;
