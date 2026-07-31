
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatusFilter from '../components/StatusFilter';
import OrdersTable from '../components/OrdersTable';
import { getOrders } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // const fetchOrders = useCallback(async (status = selectedStatus, page = 1) => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const response = await getOrders({ status, page });
  //     setOrders(response.data);
  //     setPagination(response.pagination);
  //   } catch (err) {
  //     setError(err.message || 'Failed to fetch orders');
  //     console.error('Error fetching orders:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [selectedStatus]);
// const fetchOrders = useCallback(async (status = selectedStatus, page = 1) => {
//   setLoading(true);
//   setError(null);

//   try {
//     const response = await getOrders({ status, page });

//     console.log("API Response:", response);
//     console.log("Orders:", response.data);
//     console.log("Orders Count:", response.data.length);

//     setOrders(response.data || []);
//     setPagination(response.pagination || {});
//   } catch (err) {
//     console.error(err);
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// }, [selectedStatus]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handleStatusChange = (status) => {
//     setSelectedStatus(status);
//     fetchOrders(status, 1);
//   };
const fetchOrders = async (status = 'ALL', page = 1) => {
  setLoading(true);
  setError(null);

  try {
    const response = await getOrders({ status, page });

    console.log("Response:", response);

    setOrders(response.data || []);
    setPagination(response.pagination);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders(selectedStatus, 1);
}, [selectedStatus]);

const handleStatusChange = (status) => {
  setSelectedStatus(status);
};
  const handleRefresh = () => {
    fetchOrders(selectedStatus, pagination.currentPage);
  };

  return (
    <div className="dashboard">
      <Navbar onRefresh={handleRefresh} isLoading={loading} />
      
      <StatusFilter 
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      <OrdersTable 
        orders={orders} 
        loading={loading}
      />

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => fetchOrders(selectedStatus, pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => fetchOrders(selectedStatus, pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;