import { useState, useEffect } from 'react';
import { createUser, getUsers, deleteUser } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await createUser({ name, email, password, role });
      setSuccess('User created successfully');
      setError(null);
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      
      // Refresh user list
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
      setSuccess(null);
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await deleteUser(userId);
        setSuccess('User deleted successfully');
        setError(null);
        
        // Refresh user list
        fetchUsers();
      } catch (err) {
        setError(err.message || 'Failed to delete user');
        setSuccess(null);
        console.error('Error deleting user:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Styles
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
    },
    form: {
      marginBottom: '1.5rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4b5563',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: '#f9fafb',
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: '#f9fafb',
    },
    button: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: '#4f46e5',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: '#ef4444',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '0.75rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1f2937',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '0.75rem',
      fontSize: '0.875rem',
      color: '#4b5563',
      borderBottom: '1px solid #e5e7eb',
    },
    alert: {
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
    successAlert: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <h2 style={styles.title}>Add New User</h2>
        
        {error && (
          <div style={{ ...styles.alert, ...styles.errorAlert }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            {success}
          </div>
        )}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <input
              style={styles.input}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user's full name"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email address"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              style={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="role">User Role</label>
            <select
              style={styles.select}
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <button 
            style={styles.button} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
      
      <div style={styles.container}>
        <h2 style={styles.title}>User List</h2>
        
        {loading && <p>Loading...</p>}
        
        {users.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;