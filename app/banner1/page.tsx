'use client';

import { useState, useEffect } from 'react'; 
import Upload from '../components/Upload';
import { useRouter } from 'next/navigation';

const ALLOWED_ID = '6802328855355b325195118c';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({ id: '', img: [] });
  const [message, setMessage] = useState('');
  const [img, setImg] = useState([]);
  const router = useRouter();

  // Fetch the banner with specific ID
  const fetchBanner = async () => {
    try {
      const res = await fetch('/api/banner1', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        const allowedBanner = data.find((item) => item.id === ALLOWED_ID);
        if (allowedBanner) {
          setEditFormData({
            id: allowedBanner.id,
            img: allowedBanner.img,
          });
          setImg(allowedBanner.img);
        }
      } else {
        console.error('Failed to fetch banner');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/banner1?id=${encodeURIComponent(ALLOWED_ID)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ img }),
      });

      if (res.ok) {
        setMessage('Banner updated successfully!');
        fetchBanner();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the banner.');
    }
  };

  const handleImgChange = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      setImg(uploadedUrls);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Banner</h1>

      <form onSubmit={handleEditSubmit} className="space-y-4">
        <Upload onImagesUpload={handleImgChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Update Banner
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {editFormData.img.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Current Banner</h2>
          <img
            src={editFormData.img[0]}
            alt="Banner Image"
            className="w-64 mt-4 border"
          />
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: "\n  .uploadcare--widget {\n    background:black;\n  }\n  ",
        }}
      />
    </div>
  );
};

export default ManageCategory;
