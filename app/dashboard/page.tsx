'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; 
import { FaCheck } from 'react-icons/fa';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
 

  // Fetch products and categories on load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/category');
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    } else {
      console.error('Failed to fetch categories');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filter products by search query
  const filterBySearch = (product) => {
    return product.title.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Filter products by selected category
  const filterByCategory = (product) => {
    const isFilteredByCategory = selectedCategory ? product.category === selectedCategory : true;
    
    // Log the filtering process for debugging
    console.log(`Filtering product: ${product.title} | Category: ${product.category} | Selected Category: ${selectedCategory} | Show: ${isFilteredByCategory}`);
    
    return isFilteredByCategory;
  };

  // Apply both search and category filters
  const filteredProducts = products.filter((product) => {
    return filterBySearch(product) && filterByCategory(product);
  });

  // Log the filtered products to check what's being displayed
  useEffect(() => {
    console.log("Filtered products:", filteredProducts);
  }, [filteredProducts]);



  console.log("data: ", products);
  


  return (
    <div className="max-w-6xl mx-auto p-4">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border p-2"
          placeholder="Search by title..."
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Pic</th>
            <th className="border p-2">Price (USD)</th> 
            <th className="border p-2">Brand</th> 
            <th className="border p-2">Category</th>
            <th className="border p-2">New Arrival</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border p-2">{product.title}</td>
              <td className="border p-2">
              <img src={`${product.img[0].replace('/upload/', '/upload/f_auto,q_10/')}`} alt="Product Image" className="w-24 h-auto" />

              </td>
              <td className="border p-2">{product.price}</td> 
              <td className="border p-2">{product.brand}</td> 
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.arrival}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

 

 
 
const colorOptions = [
  '#FF0000', '#00FF00', '#0000FF' , '#FF00FF', '#00FFFF',   
  '#FFFFFF', '#000000', '#ffdc7a', '#A52A2A', '#800080', '#FFD700',  '#008000', '#808080' , '#8B4513'   
];

function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [img, setImg] = useState(product.img || []);
  const [description, setDescription] = useState(product.description);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(product.category || "");
  const [selectedBrand, setSelectedBrand] = useState(product.brand || "");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [arrival, setArrival] = useState(product.arrival === 'yes');
  const [box, setNumberOfBoxesArray] = useState(product.box || [""]);
  const [size, setSizes] = useState(product.size || []);
  const [color, setColors] = useState(product.color || []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/brand"),
        ]);

        setCategories(await categoriesRes.json());
        setBrands(await brandsRes.json());
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleAddBox = () => {
    setNumberOfBoxesArray([...box, ""]);
  };

  const handleBoxChange = (index, value) => {
    const updatedBoxes = [...box];
    updatedBoxes[index] = value;
    setNumberOfBoxesArray(updatedBoxes);
  };

  const handleAddSize = () => {
    setSizes([...size, ""]);
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...size];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };

  const handleColorSelect = (selectedColor) => {
    if (color.includes(selectedColor)) {
      setColors(color.filter((c) => c !== selectedColor));
    } else {
      setColors([...color, selectedColor]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...product,
      title,
      description,
      img,
      price,
      box,
      size,
      color,
      category: selectedCategory,
      brand: selectedBrand,
      arrival: arrival ? 'yes' : 'no',
    });
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          placeholder="Title"
          required
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        {isEditingCategory ? (
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            onBlur={() => setIsEditingCategory(false)}
            className="w-full border p-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={selectedCategory}
            onClick={() => setIsEditingCategory(true)}
            readOnly
            className="w-full border p-2 cursor-pointer"
          />
        )}
      </div>

      {/* Brand */}
      <div className="mb-4">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
          Brand
        </label>
        {isEditingBrand ? (
          <select
            id="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            onBlur={() => setIsEditingBrand(false)}
            className="w-full border p-2"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={selectedBrand}
            onClick={() => setIsEditingBrand(true)}
            readOnly
            className="w-full border p-2 cursor-pointer"
          />
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2"
          placeholder="Price"
          required
        />
      </div>

      {/* Boxes */}
      <div className="mb-4">
        <label htmlFor="numberOfBoxes" className="block text-sm font-medium text-gray-700">
          Number of Boxes
        </label>
        {box?.map((boxItem, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="number"
              value={boxItem}
              onChange={(e) => handleBoxChange(index, e.target.value)}
              className="w-full border p-2 mr-2"
              placeholder="Box Number"
            />
            <button
              type="button"
              onClick={() => {
                const updatedBoxes = box.filter((_, i) => i !== index);
                setNumberOfBoxesArray(updatedBoxes);
              }}
              className="bg-red-500 text-white px-2 py-1"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddBox}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          + Add Box
        </button>
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
          Sizes
        </label>
        {size?.map((sizeValue, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={sizeValue}
              onChange={(e) => handleSizeChange(index, e.target.value)}
              className="w-full border p-2 mr-2"
              placeholder="Size"
            />
            <button
              type="button"
              onClick={() => {
                const updatedSizes = size.filter((_, i) => i !== index);
                setSizes(updatedSizes);
              }}
              className="bg-red-500 text-white px-2 py-1"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSize}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          + Add Size
        </button>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <div className="flex flex-wrap">
          {colorOptions.map((colorOption) => (
            <div
              key={colorOption}
              onClick={() => handleColorSelect(colorOption)}
              className={`w-8 h-8 m-2 cursor-pointer rounded-full relative border-2 ${
                color.includes(colorOption) ? 'border-black' : ''
              }`}
              style={{ backgroundColor: colorOption }}
            >
              {color.includes(colorOption) && (
                <FaCheck className="text-white absolute top-1 left-1 w-4 h-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          className="mb-4"
          theme="snow"
          placeholder="Write your product description here..."
        />
      </div>

      {/* New Arrival */}
      <div className="mb-4">
        <input
          type="checkbox"
          checked={arrival}
          onChange={(e) => setArrival(e.target.checked)}
        />
        <label className="ml-2 text-sm font-medium">New Arrival</label>
      </div>

      <Upload onImagesUpload={handleImgChange} />

      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


