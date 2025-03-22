// hooks/useFormInput.js
import { useState } from 'react';

export function useFormInput(initialState) {
  const [state, setState] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return [state, handleInputChange, setState];
}
