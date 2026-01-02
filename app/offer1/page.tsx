'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import { useRouter } from 'next/navigation';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({ id: '', text: '', img: [] });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  const allowedId = '680236fd55355b32519511a0';

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/offer1', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Edit
  const handleEdit = (category) => {
    if (category.id !== allowedId) {
      alert('You are only allowed to edit a specific item.');
      return;
    }

    setEditMode(true);
    setEditFormData({
      id: category.id,
      text: category.text,
      img: category.img,
    });
    setImg(category.img);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/offer1?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editFormData.text,
          img: img,
        }),
      });

      if (res.ok) {
        setEditFormData({ id: '', text: '', img: [] });
        setImg([]);
        setEditMode(false);
        fetchCategories();
        window.location.reload();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the category.');
    }
  };

  const handleImgChange = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      setImg(uploadedUrls);
    }
  };

  useEffect(() => {
    if (!img.includes('')) {
      setEditFormData((prevState) => ({ ...prevState, img }));
    }
  }, [img]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit</h1>

      {editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Text</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={editFormData.text}
              onChange={(e) =>
                setEditFormData({ ...editFormData, text: e.target.value })
              }
              required
            />
          </div>

          <Upload onImagesUpload={handleImgChange} />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Update
          </button>
        </form>
      )}

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">Offer text</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Text</th>
            <th className="border border-gray-300 p-2">Pic</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 p-2">{category.text}</td>
                <td className="border border-gray-300 p-2"><img src={`${category.img[0]}`}  alt="Product Image" className="w-24 h-auto" /></td>
                <td className="border border-gray-300 p-2 text-center">
                  {category.id === allowedId && (
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border border-gray-300 p-2 text-center">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .uploadcare--widget {
              background: black;
            }
          `,
        }}
      />
    </div>
  );
};

export default ManageCategory;
