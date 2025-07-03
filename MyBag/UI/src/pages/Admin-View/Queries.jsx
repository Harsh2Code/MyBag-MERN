import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');

  // Fetch queries from backend API
  useEffect(() => {
    async function fetchQueries() {
      setIsLoading(true);
      try {
        const response = await fetch('https://mybag-server-mern.onrender.com/api/queries', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch queries');
        }
        const data = await response.json();
        setQueries(data);
      } catch (error) {
        toast.error('Failed to load queries.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQueries();
  }, []);

  const handleShowMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setSelectedMessage('');
  };

  return (
    <div className="admin-main">
      <h2>User Queries</h2>
      {isLoading ? (
        <p>Loading queries...</p>
      ) : queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queries.map(query => (
                <tr key={query._id}>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>{query.subject}</td>
                  <td>
                    <button className="btn btn-dark btn-sm" onClick={() => handleShowMessage(query.message)}>
                      View Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMessageModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={handleCloseModal}>
              <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">User Message</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <p>{selectedMessage}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-dark" onClick={handleCloseModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" className="p-3" />
    </div>
  );
}
