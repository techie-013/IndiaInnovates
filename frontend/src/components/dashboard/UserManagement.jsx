import React, { useState } from 'react';
import { HiSearch, HiChevronLeft, HiChevronRight, HiTrash, HiPencil } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';

const UserManagement = ({ users, onUpdateRole, onDelete }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const itemsPerPage = 10;

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleRoleChange = (userId, newRole, department) => {
    onUpdateRole(userId, newRole, department);
    setEditingUser(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <select
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value, user.department)}
                      className="text-sm border rounded px-2 py-1"
                      autoFocus
                    >
                      <option value="citizen">Citizen</option>
                      <option value="official">Official</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'official' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.role === 'official' && editingUser === user.id ? (
                    <input
                      type="text"
                      defaultValue={user.department || ''}
                      onBlur={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                      placeholder="Department"
                      className="text-sm border rounded px-2 py-1 w-28"
                    />
                  ) : (
                    user.department || '-'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;