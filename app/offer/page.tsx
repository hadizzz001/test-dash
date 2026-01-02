'use client';

import { useState, useEffect } from 'react';

const ManageCategory = () => {
  const [textInputs, setTextInputs] = useState(['']);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const TARGET_ID = '6802331e55355b325195119a';

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await fetch('/api/offer');
      if (res.ok) {
        const data = await res.json();
        const target = data.find((cat) => cat.id === TARGET_ID);
        if (target) {
          setTextInputs(target.text || ['']);
          setEditMode(true);
        } else {
          setMessage('No editable category found.');
        }
      } else {
        console.error('Failed to fetch category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTextChange = (index, value) => {
    const updated = [...textInputs];
    updated[index] = value;
    setTextInputs(updated);
  };

  const addTextField = () => {
    setTextInputs([...textInputs, '']);
  };

  const removeTextField = (index) => {
    const updated = [...textInputs];
    updated.splice(index, 1);
    setTextInputs(updated.length ? updated : ['']); // ensure at least one field
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/offer?id=${TARGET_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInputs }),
      });

      if (res.ok) {
        setMessage('Updated successfully!');
        fetchCategory();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Offer</h1>

      {editMode ? (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {textInputs.map((text, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder={`Text #${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeTextField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addTextField}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Text Field
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 ml-4"
          >
            Update
          </button>
        </form>
      ) : (
        <p>{message}</p>
      )}

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ManageCategory;
