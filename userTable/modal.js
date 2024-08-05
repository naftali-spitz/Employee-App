import { Modal, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

const AddEmployeeModal = ({
  isModalVisible,
  hideModal,
  handleClearFields,
  handleNewEmployee,
  newEmployee,
  setNewEmployee,
}) => {
  const handleCancel = () => {
    handleClearFields(),
    hideModal()
  }
  return(
    <Modal
    animationType="fade"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={hideModal}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add New Employee</Text>
      </View>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter employee first name"
        value={newEmployee.firstName}
        onChangeText={(text) => setNewEmployee({ ...newEmployee, firstName: text })}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter employee last name"
        value={newEmployee.lastName}
        onChangeText={(text) => setNewEmployee({ ...newEmployee, lastName: text })}
      />
      <Text style={styles.label}>Phone Number</Text>      
      <TextInput
        style={styles.input}
        placeholder="Enter employee phone number"
        value={newEmployee.phoneNumber}
        onChangeText={(text) => setNewEmployee({ ...newEmployee, phoneNumber: text })}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter employee email"
        value={newEmployee.email}
        onChangeText={(text) => setNewEmployee({ ...newEmployee, email: text })}
      />
      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter employee role"
        value={newEmployee.role}
        onChangeText={(text) => setNewEmployee({ ...newEmployee, role: text })}
      />
      <TouchableOpacity style={styles.buttonStyle} onPress={handleClearFields}>
        <Text style={styles.buttonTextStyle}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleNewEmployee}>
        <Text style={styles.buttonTextStyle}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleCancel}>
        <Text style={styles.buttonTextStyle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)};

export default AddEmployeeModal;

const styles = StyleSheet.create({
  modalContainer: {
    margin: 40,
    backgroundColor: '#03fcdb',
    borderRadius: 20,
    padding: 10,
    alignItems: 'right',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    }
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
  modalHeader: {
    backgroundColor: 'transparent',
    padding: 5,
    alignItems: 'center',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin:6,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 8,
  },
  label: {
    fontSize: 10,
    marginTop: 8, // Space between label and input
    marginStart: 8,
    color: 'gray'
  },

})