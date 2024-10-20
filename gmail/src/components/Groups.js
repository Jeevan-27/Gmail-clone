import React, { useState, useEffect } from 'react';
import { FiPlus, FiUsers, FiMail, FiInfo } from 'react-icons/fi';
import './Groups.css';
import axios from 'axios';

const Groups = ({ isDarkTheme }) => {
  const [groups, setGroups] = useState([]);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', members: '', description: '' });
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 4; // Show 4 groups per page

  const loggedUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
  const emailId = loggedUser?.email; // Use email instead of _id

  // Fetch groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.post('http://localhost:1973/api/groups/fetch-groups', {
          emailId: emailId, // Send emailId to fetch groups
        });
        setGroups(response.data); // Use fetched groups directly
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [emailId]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const handleCreateGroup = async () => {
  //   if (!newGroup.name) {
  //     setError('Group name is required');
  //     return;
  //   }

  //   const membersArray = newGroup.members.split(',').map(email => email.trim());
  //   if (!membersArray.every(isValidEmail)) {
  //     setError('One or more email addresses are invalid');
  //     return;
  //   }

  //   // Create group object based on the new schema
  //   const groupToCreate = {
  //     groupName: newGroup.name, 
  //     members: membersArray, 
  //     groupDescription: newGroup.description || '', 
  //     ownerId: loggedUser.emailId, 
  //   };

  //   try {
  //     const response = await axios.post('http://localhost:1973/api/groups/create', groupToCreate);
  //     setGroups([...groups, response.data.group]); 
  //     setNewGroup({ name: '', members: '', description: '' });
  //     setIsAddingGroup(false);
  //     setError('');
  //   } catch (error) {
  //     console.error('Error creating group:', error);
  //     setError('Failed to create group. Please try again.');
  //   }
  // };

  const handleCreateGroup = async () => {
    if (!newGroup.name) {
      setError('Group name is required');
      return;
    }
  
    // Split and validate members' emails
    const membersArray = newGroup.members.split(',').map(email => email.trim());
    if (!membersArray.every(isValidEmail)) {
      setError('One or more email addresses are invalid');
      return;
    }
  
    // Get logged-in user's email from localStorage
    const loggedUser = JSON.parse(localStorage.getItem('user'));
  
    // Create the group payload
    const groupToCreate = {
      groupName: newGroup.name,
      members: membersArray,
      groupDescription: newGroup.description,
      emailId: loggedUser.email, // Send the logged user's email as ownerId
    };
  
    try {
      // Send a POST request to create the group
      const response = await axios.post(
        'http://localhost:1973/api/groups/create',
        groupToCreate // Send the group data as the request body
      );
  
      // If successful, add the new group to the list of groups
      setGroups([...groups, response.data.group]);
      setNewGroup({ name: '', members: '', description: '' });
      setIsAddingGroup(false);
      setError('');
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group. Please try again.');
    }
  };    

  // Pagination logic
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(groups.length / groupsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`groups-container ${isDarkTheme ? 'dark' : ''}`}>
      <div className="groups-list">
        {currentGroups.map(group => (
          <div key={group._id} className="groups-item">
            <h3 className="groups-item-name">
              <FiUsers className="icon" /> {group.groupName}
            </h3>
            <p className="groups-item-members">
              <FiMail className="icon" /> {group.members.join(', ')}
            </p>
            {group.groupDescription && (
              <p className="groups-item-description">
                <FiInfo className="icon" /> {group.groupDescription}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {isAddingGroup && (
        <div className="groups-dialog">
          <div className="groups-add-form">
            <h4>Create New Group</h4>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Member Emails (comma-separated)"
              value={newGroup.members}
              onChange={(e) => setNewGroup({ ...newGroup, members: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            />
            {error && <p className="groups-error">{error}</p>}
            <button onClick={handleCreateGroup} className="groups-create-btn" disabled={!newGroup.name || !newGroup.members}>
              Create Group
            </button>
            <button className="groups-cancel-btn" onClick={() => setIsAddingGroup(false)}>Cancel</button>
          </div>
        </div>
      )}
      <button className="groups-floating-btn" onClick={() => setIsAddingGroup(true)}>
        <FiPlus size={24} />
      </button>
    </div>
  );
};

export default Groups;