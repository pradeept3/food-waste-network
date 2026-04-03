import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Users, Edit2, Trash2, Check, X, Lock, Unlock } from 'lucide-react';

const AdminPanel = ({ token, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    user_type: ''
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete user ${userName}?`)) {
      try {
        setError('');
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('User deleted successfully');
        fetchAllUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete user');
      }
    }
  };

  const handleToggleAccess = async (userId) => {
    try {
      setError('');
      const response = await axios.put(
        `/api/admin/users/${userId}/toggle-access`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess(response.data.message);
      fetchAllUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user access');
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      setError('');
      const response = await axios.put(
        `/api/admin/users/${userId}/toggle-admin`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess(response.data.message);
      fetchAllUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update admin role');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      user_type: user.user_type
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      setError('');
      const response = await axios.put(
        `/api/admin/users/${userId}`,
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('User updated successfully');
      setEditingUser(null);
      fetchAllUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      user_type: ''
    });
  };

  const userTypes = [
    'restaurant',
    'store',
    'farm',
    'ngo',
    'shelter',
    'buyer'
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
          Total Users: {users.length}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-800">Success</h3>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editingUser === user.id ? (
                  // Edit Mode
                  <>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editForm.user_type}
                        onChange={(e) => setEditForm({ ...editForm, user_type: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      >
                        {userTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td colSpan="3" className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleSaveEdit(user.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // View Mode
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.is_active ? (
                        <span className="inline-flex items-center space-x-1">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 font-medium">Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1">
                          <X className="h-4 w-4 text-red-600" />
                          <span className="text-red-700 font-medium">Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.is_admin ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          ⭐ Admin
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(user)}
                        title="Edit user"
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>

                      {/* Toggle Access Button */}
                      <button
                        onClick={() => handleToggleAccess(user.id)}
                        disabled={currentUser.id === user.id}
                        title={user.is_active ? "Disable user" : "Enable user"}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                          user.is_active
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        } ${currentUser.id === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {user.is_active ? (
                          <>
                            <Lock className="h-4 w-4" />
                            <span className="text-xs">Disable</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4" />
                            <span className="text-xs">Enable</span>
                          </>
                        )}
                      </button>

                      {/* Toggle Admin Button */}
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        disabled={currentUser.id === user.id}
                        title={user.is_admin ? "Remove admin role" : "Make admin"}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded transition-colors text-white ${
                          user.is_admin
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-gray-500 hover:bg-gray-600'
                        } ${currentUser.id === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-xs">{user.is_admin ? 'Remove ⭐' : 'Make Admin'}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={currentUser.id === user.id}
                        title="Delete user"
                        className={`inline-flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
                          currentUser.id === user.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
