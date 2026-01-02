"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';
import { FaCheck } from 'react-icons/fa';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const colorOptions = [
  '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF',
  '#FFFFFF', '#000000', '#ffdc7a', '#A52A2A', '#800080', '#FFD700', '#008000', '#808080', '#8B4513'
];

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(['']);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [box, setNumberOfBoxes] = useState([]); // now string[]
  const [sizes, setSizes] = useState(['']);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/category`);
        if (response.ok) {
          const data = await response.json();
          setCategoryOptions(data);
          setSelectedCategory('');
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch(`/api/brand`);
        if (response.ok) {
          const data = await response.json();
          setBrandOptions(data);
        } else {
          console.error('Failed to fetch brands');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }
    fetchBrands();
  }, []);

  const handleAddBox = () => {
    setNumberOfBoxes([...box, '']);
  };

  const handleBoxChange = (index, value) => {
    const newBoxes = [...box];
    newBoxes[index] = value;
    setNumberOfBoxes(newBoxes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, '']);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const handleColorSelect = (color) => {
    if (colors.includes(color)) {
      setColors(colors.filter((c) => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img.length === 1 && img[0] === '') {
      alert('Please choose at least 1 image');
      return;
    }

    const payload = {
      title,
      description,
      brand: selectedBrand,
      price,
      img,
      category: selectedCategory,
      box, // already string[]
      size: sizes,
      color: colors,
      ...(isNewArrival && { arrival: "yes" })
    };

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('Product added successfully!');
      window.location.href = '/dashboard';
    } else {
      alert('Failed to add product');
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <label className="block text-lg font-bold mb-2">Brand</label>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a Brand</option>
        {brandOptions.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="block text-lg font-bold mb-2">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a category</option>
        {categoryOptions.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      {/* Number of Boxes Inputs */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Number of Boxes</label>
        {box.map((boxField, index) => (
  <div key={index} className="flex items-center mb-2">
    <input
      type="number"
      value={boxField}
      onChange={(e) => handleBoxChange(index, e.target.value)}
      placeholder={`Box ${index + 1}`}
      className="w-full border p-2 mr-2"
    />
    <button
      type="button"
      onClick={() => {
        const newBoxes = [...box];
        newBoxes.splice(index, 1);
        setNumberOfBoxes(newBoxes);
      }}
      className="text-red-500 font-bold"
    >
      ❌
    </button>
  </div>
))}


        <button
          type="button"
          onClick={handleAddBox}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Add Box
        </button>
      </div>

      {/* Sizes Inputs */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Sizes</label>
        {sizes.map((sizeField, index) => (
  <div key={index} className="flex items-center mb-2">
    <input
      type="text"
      value={sizeField}
      onChange={(e) => handleSizeChange(index, e.target.value)}
      placeholder={`Size ${index + 1}`}
      className="w-full border p-2 mr-2"
    />
    <button
      type="button"
      onClick={() => {
        const newSizes = [...sizes];
        newSizes.splice(index, 1);
        setSizes(newSizes);
      }}
      className="text-red-500 font-bold"
    >
      ❌
    </button>
  </div>
))}

        <button
          type="button"
          onClick={handleAddSize}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Add Size
        </button>
      </div>

      {/* Colors Selection */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Colors</label>
        <div className="flex flex-wrap">
          {colorOptions.map((color) => (
            <div
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 m-2 cursor-pointer rounded-full relative border-2 ${colors.includes(color) ? 'border-black' : ''}`}
              style={{ backgroundColor: color }}
            >
              {colors.includes(color) && (
                <FaCheck className="text-white absolute top-1 left-1 w-4 h-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onImagesUpload={handleImgChange} />

      {/* New Arrival Checkbox */}
      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="newArrival"
          checked={isNewArrival}
          onChange={(e) => setIsNewArrival(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="newArrival" className="text-lg font-bold">
          New Arrival
        </label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save Product
      </button>
    </form>
  );
}
