import React from "react";
import "./BookingForm.css";
interface FieldData {
  id: number;
  name: string;
  isBooked: boolean;
}

interface TableProps {
  fields: FieldData[];
  onFieldClick: (fieldId: number) => void;
}

const FieldTable: React.FC<TableProps> = ({ fields, onFieldClick }) => {
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
            key={field.id}
            onClick={() => onFieldClick(field.id)}
            className={field.isBooked ? "booked" : "available"}
          >
            <td>{field.id}</td>
            <td>{field.name}</td>
            <td>{field.isBooked ? "Bokad" : "Ledig"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FieldTable;
