import React from "react";
import "./BookingForm.css";
interface FieldData {
  idField: number;
  name: string;
  isBooked: boolean;
}

interface TableProps {
  fields: FieldData[];
 handleFieldClick: (fieldId: number, isTable1: boolean) => void; 
  isTable1: boolean;
}

const FieldTable: React.FC<TableProps> = ({ fields,  handleFieldClick, isTable1}) => {
  // const handleFieldClick = (fieldId: number) => {
   
  //   onFieldClick(fieldId);
  // };
  
  return (
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
            key={field.idField}
            onClick={() => handleFieldClick(field.idField, isTable1)}
            className={field.isBooked ? "booked" : "available"}
          >
            <td>{field.idField}</td>
            <td>{field.name}</td>
            <td>{field.isBooked ? "Bokad" : "Ledig"}</td>
        
          </tr>
        ))}
       
      </tbody>
    </table>
  );
};

export default FieldTable;