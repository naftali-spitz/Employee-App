import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList ,Text, Alert, ActivityIndicator } from 'react-native';
import AddEmployeeModal from './modal';
const apiUrl = 'http://192.168.1.28:3000/users';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [editStatus, setEditStatus] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    role: '',
  })
  const [sortBy, setSortBy] = useState({ column: '', order: '' });
  const [loading, setLoading] = useState(false); // Loading state


  const handleSort = (column) => {
    const sortOrder = sortBy.column === column && sortBy.order === 'ASC' ? 'DESC' : 'ASC';
    setSortBy({ column, order: sortOrder });
    fetchSortedUsers(column, sortOrder);
  };

  const fetchSortedUsers = async (column, order) => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/sorted?sortBy=${column}&sortOrder=${order}`);
      const data = await response.json();
      setEmployees(data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sorted users:', error);
      setLoading(false)
    }
  };
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setEmployees(data);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false)
      }
    };
    fetchEmployees();
  }, []);
  
  const handleClearFields = () => {
    setNewEmployee({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    role: '',
    })
  }

  const handleDeleteEmployee = async (index) => {
    const employeeId = employees[index].id;
    Alert.alert('Delete', 'Confirm removal of employee from company records?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Ok',
        onPress: async () => {
          try {
            const response = await fetch(`${apiUrl}/${employeeId}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              // User deleted successfully
              const newEmployees = [...employees];
              newEmployees.splice(index, 1);
              setEmployees(newEmployees);
            } else {
              // Error deleting user
              alert('Error deleting user');
            }
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        },
      },
    ]);
  }

  const handleEditEmployee = (index) => {
    const employeeToEdit = employees[index];
    setEditStatus(true)
    setNewEmployee(employeeToEdit);
    showModal()
  }
  const handleNewEmployee = async () => {
    if (newEmployee.firstName.trim() === '') {
      alert('First name is required');
      return;
    }
  
    if (newEmployee.lastName.trim() === '') {
      alert('Last name is required');
      return;
    }
  
    // const phoneNumberRegex = /^\d{10}$/;
    // if (!phoneNumberRegex.test(newEmployee.phoneNumber)) {
    //   alert('Invalid phone number format. Not enough digits ');
    //   return;
    // }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmployee.email)) {
      alert('Invalid email address');
      return;
    }
  
    if (newEmployee.role.trim() === '') {
      alert('Role is required');
      return;
    }
    
    if (!editStatus) {
    const isDuplicate = employees.some(employee =>
      employee.firstName === newEmployee.firstName &&
      employee.lastName === newEmployee.lastName &&
      employee.phoneNumber === newEmployee.phoneNumber &&
      employee.email === newEmployee.email
    );
    if (isDuplicate){
      alert('This employee already exists.');
      return;
    }
  }
    try {
      const url = editStatus ? `${apiUrl}/${newEmployee.id}` : apiUrl;
      const method = editStatus ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(newEmployee)
        })
      if (response.ok) {
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }

        setEditStatus(false);
        handleClearFields();
        hideModal();
      } else {
        // Error creating user
        alert('Error creating user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  return (
    <View style={styles.container}>
      {loading ? ( // Conditional rendering of ActivityIndicator
        <ActivityIndicator style={styles.indicator} size="large" />
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText} onPress={() => handleSort('firstName')}>First Name</Text>
            <Text style={styles.tableHeaderText} onPress={() => handleSort('lastName')}>Last Name</Text>
            <Text style={styles.tableHeaderText} onPress={() => handleSort('phoneNumber')}>Phone Number</Text>
            <Text style={styles.tableHeaderText} onPress={() => handleSort('email')}>Email</Text>
            <Text style={styles.tableHeaderText} onPress={() => handleSort('role')}>Role</Text>
            <Text style={styles.iconButton}></Text>
            <Text style={styles.iconButton}></Text>
          </View>
          <FlatList
            data={employees}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.firstName}</Text>
                <Text style={styles.tableCell}>{item.lastName}</Text>
                <Text style={styles.tableCell}>{item.phoneNumber}</Text>
                <Text style={styles.tableCell}>{item.email}</Text>
                <Text style={styles.tableCell}>{item.role}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleEditEmployee(index)}>
                  <Image source={require('./edit-icon.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteEmployee(index)}>
                  <Image source={require('./delete-icon.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <AddEmployeeModal
            isModalVisible={isModalVisible}
            hideModal={hideModal}
            handleClearFields={handleClearFields}
            handleNewEmployee={handleNewEmployee}
            newEmployee={newEmployee}
            setNewEmployee={setNewEmployee}
          />
          <TouchableOpacity style={styles.buttonStyle} onPress={showModal}>
            <Text style={styles.buttonTextStyle}>Add Employee</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 25,
    marginTop: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    margin: 6,
    flex: 1,
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  tableCell: {
    fontSize: 10,
    margin: 6,
    flex: 1,
  },
  tableContent: {
    flexGrow: 1
  },
  iconButton: {
    flex: 1,
    alignItems: 'left',
    padding: 1, 
    borderRadius: 10
  },
  icon: {
    backgroundColor: 'white', 
    width: 30,
    height: 30,
  },
  buttonStyle: {
    backgroundColor: '#4CAF50', // green
    borderRadius: 10,
    padding: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 2
  },
  buttonTextStyle: {
    fontSize: 20,
    color: '#FFFFFF', // white
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  indicator: {
    flex: 1
    
  }
});

export default EmployeeTable;