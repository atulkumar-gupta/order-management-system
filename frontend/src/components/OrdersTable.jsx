import React from 'react';
import './OrdersTable.css';

const OrdersTable = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No orders found</h3>
          <p>Try adjusting your filter or create a new order</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'PLACED': '#3498db',
      'PROCESSING': '#f39c12',
      'READY_TO_SHIP': '#2ecc71',
      'COMPLETED': '#27ae60',
      'CANCELLED': '#e74c3c'
    };
    return colors[status] || '#6c757d';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'PAID': '#27ae60',
      'PENDING': '#f39c12',
      'FAILED': '#e74c3c'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>📋 Orders List</h3>
        <span className="order-count">{orders.length} orders</span>
      </div>
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id">{order.orderId}</td>
                <td className="customer-name">{order.customerName}</td>
                <td className="phone-number">{order.phoneNumber}</td>
                <td className="product-name">{order.productName}</td>
                <td className="amount">${order.amount.toFixed(2)}</td>
                <td>
                  <span 
                    className="status-badge payment-status"
                    style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge order-status"
                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="created-time">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;