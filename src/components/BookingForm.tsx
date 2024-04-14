import React, { useEffect, useRef, useState } from "react";
import "./BookingForm.css";
import IndependentFieldTable from "./FieldTable";


interface FieldData {
  id: number;
  name: string;
  isBooked: boolean;
}

interface Props {
  onCancel: () => void;
  selectedDate: Date;
  fieldStates: FieldData[];

  getFieldStates: (states: FieldData[]) => void;
  initialFieldStates: { [key: string]: FieldData[] };
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookingForm: React.FC<Props> = ({ onCancel, selectedDate, initialFieldStates }) => {
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [fieldStates1, setFieldStates1] = useState<FieldData[]>([]);
  const [fieldStates2, setFieldStates2] = useState<FieldData[]>([]);
  const cache = useRef<{ [key: string]: { fieldStates1: FieldData[]; fieldStates2: FieldData[] } }>({});


  const fetchBookingData = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch("http://localhost:3000/bookings", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json", 
          
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Data", data);
        return data;
      } else {
        const errorMessage = `Failed to fetch booking data: ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  };
  
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    if (!cache.current[dateString]) {
      fetchBookingData()
        .then((data) => {
          cache.current[dateString] = {
            fieldStates1: data.fieldStates1 || [],
            fieldStates2: data.fieldStates2 || [],
          };
          setFieldStates1(data.fieldStates1 || []);
          setFieldStates2(data.fieldStates2 || []);
        })
        .catch((error) => {
          console.error("Error fetching booking data:", error);
        });
    } else {
    
      setFieldStates1(cache.current[dateString].fieldStates1);
      setFieldStates2(cache.current[dateString].fieldStates2);
    }
  }, [selectedDate]);
  
  useEffect(() => {
    setFieldStates1([]);
    setFieldStates2([]);
  }, [selectedDate]);
  

  

const handleSave = async () => {
  const correctedDate = new Date(selectedDate);
  correctedDate.setDate(correctedDate.getDate() + 1);
  const dataToSave = {
    selectedDate: correctedDate.toISOString(),
    fieldStates1: fieldStates1,
    fieldStates2: fieldStates2,
  };

  try {
    const response = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    });

    if (response.ok) {
      console.log("Data successfully saved");
      setIsFormSaved(true);
    } else {
      console.error("Failed to save data.");
    }
  } catch (error) {
    console.error("Error", error);
  }
};


const handleFieldStates1 = (states: FieldData[]) => {
  const dateString = selectedDate.toISOString().split('T')[0];
  if (!cache.current[dateString]) {
    cache.current[dateString] = {
      fieldStates1: [],
      fieldStates2: [],
    };
  }
  setFieldStates1(states);
  cache.current[dateString].fieldStates1 = states;
};

const handleFieldStates2 = (states: FieldData[]) => {
  const dateString = selectedDate.toISOString().split('T')[0];
  if (!cache.current[dateString]) {
    cache.current[dateString] = {
      fieldStates1: [],
      fieldStates2: [],
    };
  }
  setFieldStates2(states);
  cache.current[dateString].fieldStates2 = states;
};
const handleFieldStatesChange = (updatedFields: FieldData[], tableNumber: number) => {
  const dateString = selectedDate.toISOString().split('T')[0];
  const cacheData = cache.current[dateString] || { fieldStates1: [], fieldStates2: [] };

  if (tableNumber === 1) {
    setFieldStates1(updatedFields);
    cacheData.fieldStates1 = updatedFields;
  } else if (tableNumber === 2) {
    setFieldStates2(updatedFields);
    cacheData.fieldStates2 = updatedFields;
  }

  cache.current[dateString] = cacheData;
};

return (

<>
<h2>Bokning för {selectedDate.toDateString()}</h2>
<div className="tableContainer">
  <div className="tableBackground1">
    <h2>Varm</h2>
    <IndependentFieldTable
      key={`table1-${selectedDate.toISOString()}`}
      selectedDate={selectedDate}
      onFieldClick={() => {}}
      getFieldStates={handleFieldStates1}
      initialFieldStates={initialFieldStates[selectedDate.toISOString().split('T')[0]] || []}
      onFieldStatesChange={(updatedFields) => handleFieldStatesChange(updatedFields, 1)}
    />
  </div>
  <div className="tableBackground2">
    <h2>Kall</h2>
    <IndependentFieldTable
      key={`table2-${selectedDate.toISOString()}`}
      selectedDate={selectedDate}
      onFieldClick={() => {}}
      getFieldStates={handleFieldStates2}
      initialFieldStates={initialFieldStates[selectedDate.toISOString().split('T')[0]] || []}
      onFieldStatesChange={(updatedFields) => handleFieldStatesChange(updatedFields, 2)}
    />
  </div>
</div>
<div>
  {isFormSaved && <p>Form has been saved!</p>}
  <button onClick={handleSave}>Boka</button>
  <button onClick={onCancel}>Avbryt</button>
</div>
</>
);
};

export default BookingForm;
