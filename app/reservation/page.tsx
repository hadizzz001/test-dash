
"use client" 
import { useState, useEffect } from "react";





const page = () => {
    const [allTemp, setTemp] = useState<any>() 
  
    // Fetch products and categories on load
    useEffect(() => {
      fetchProducts(); 
    }, []);
  
    const fetchProducts = async () => {
      const response = await fetch('/api/order');
      if (response.ok) {
        const data = await response.json();
        setTemp(data);
      } else {
        console.error('Failed to fetch products');
      }
    };
    



    const calculateFinalTotal = (allTemp1) => {
      if (allTemp1) {
        const result = allTemp1.reduce(
          (acc, post) => {
            const price = parseFloat(post.price); // changed to parseFloat
            const qty = post.quantity;
            acc.totalPrice += isNaN(price) || isNaN(qty) ? 0 : price * qty;
            acc.totalItems += isNaN(qty) ? 0 : qty;
            return acc;
          },
          { totalPrice: 0, totalItems: 0 }
        );
    
        return result;
      }
    
      return { totalPrice: 0, totalItems: 0 };
    };
    
 



    const deleteOrder = async (orderId: string) => {
      try {
        const response = await fetch(`/api/order/${orderId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          alert('Order deleted successfully.');
          window.location.replace("/reservation");
        } else {
          alert('Failed to delete order.');
        }
      } catch (error) {
        console.error(error);
        alert('Error deleting order.');
      }
    };



    return (
        <> 
           <table className="table table-striped container">
      <thead>
        <tr>
          <th scope="col">Phone</th>
          <th scope="col">Total Amount</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {
          allTemp && allTemp?.length > 0 ? (
            allTemp.map((post: any, index: number) => (
              <tr key={index}>
                <td>{post.cartItems.phone}</td>
                <td>${(calculateFinalTotal(post.userInfo).totalPrice + 5).toFixed(2)}</td>
                <td>
                  <a className="text-blue-700 mr-3 bg-black p-1" href={`/order?id=${post.id}`}>View</a>
                  <button
                    onClick={() => deleteOrder(post.id)} // Call delete function here
                    className="text-white bg-red-600 p-1 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <div className='home___error-container'>
                  <h2 className='text-black text-xl dont-bold'>No orders found.</h2>
                </div>
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
        </>

    )
}

export default page