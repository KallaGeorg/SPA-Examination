import React, { useEffect, useState } from "react";
import "./BookingForm.css";
interface FieldData {
  id: number;
  name: string;
  isBooked: boolean;
}

interface Props{
  selectedDate: Date;
  onFieldClick:(fieldId: number) => void;
  
  getFieldStates: (states: FieldData[]) => void;
  initialFieldStates: FieldData[];
  onFieldStatesChange: (updatedFields: FieldData[]) => void;
}
  
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IndependentFieldTable: React.FC<Props> = ({selectedDate, onFieldClick, onFieldStatesChange,getFieldStates, initialFieldStates}) => {
  const [fields, setFields] = useState<FieldData[]>(
    initialFieldStates.length > 0
      ? initialFieldStates
      : [
          { id: 1, name: "Förmiddag", isBooked: false },
          { id: 2, name: "Eftermiddag", isBooked: false },
          { id: 3, name: "Kväll", isBooked: false },
        ]
  );

  const handleFieldClick = (fieldId: number) => {
    onFieldClick(fieldId);
    setFields((prevFields) => {
      return prevFields.map((field) =>
        field.id === fieldId ? { ...field, isBooked: !field.isBooked } : field
      );
    });
  };


  useEffect(() => {
    
    onFieldStatesChange(fields);
  }, [fields, onFieldStatesChange]);
  return (
    <div>
      <h2>Selected Date: {selectedDate.toDateString()}</h2>
    <table>
      <thead>
        <tr>
          <th>Tillfälle</th>
          <th>Tid</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr 
            key={field.id}
            onClick={() => handleFieldClick(field.id)}
            className={field.isBooked ? "booked" : "available"}
          >
            <td>{field.id}</td>
            <td>{field.name}</td>
            <td>{field.isBooked ? "Bokad" : "Ledig"}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
  );
};
export default IndependentFieldTable;








