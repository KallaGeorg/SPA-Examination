import React from 'react';

interface CredentialFormProps{
    // onSave: (formData: {name: string; email: string}) => void;
    setFormData: React.Dispatch<React.SetStateAction<{name: string; email:string}>>;
}



const CredentialForm: React.FC<CredentialFormProps> = ({ setFormData}) =>{
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, 
            [name]: value,
        }));
    };
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     onSave({name:'', email:''});
    //     setFormData({ name: '', email: '' });
    // };
return(
    <form >
        <div>
            <label htmlFor="name">Namn:</label>
            <input
            type='text'
            id='name'
            name='name'
            onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="email">E-post adress:</label>
            <input
            type='text'
            id='email'
            name='email'
            onChange={handleChange}
            />
        </div>
       
    </form>

 );
};
export default CredentialForm;