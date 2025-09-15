// Universal Patient Modal Management
class PatientModal {
    constructor() {
        this.modal = document.getElementById('patientModal');
        this.form = document.getElementById('patientForm');
        this.modalTitle = document.querySelector('.modal-header h2');
        this.saveBtn = document.querySelector('button[type="submit"]');
        this.currentMode = null;
        this.currentPatientData = null;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Close modal events
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Form submission
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }
    
    // Open modal in ADD mode
    openAddMode() {
        this.currentMode = 'add';
        this.modalTitle.textContent = 'Add New Patient';
        this.saveBtn.textContent = 'Save Patient';
        this.clearForm();
        this.setFieldsReadonly(false);
        this.showModal();
    }
    
    // Open modal in VIEW mode
    openViewMode(patientData) {
        this.currentMode = 'view';
        this.currentPatientData = patientData;
        this.modalTitle.textContent = 'View Patient Details';
        this.saveBtn.style.display = 'none';
        this.populateForm(patientData);
        this.setFieldsReadonly(true);
        this.showModal();
    }
    
    // Open modal in EDIT mode
    openEditMode(patientData) {
        this.currentMode = 'edit';
        this.currentPatientData = patientData;
        this.modalTitle.textContent = 'Edit Patient Information';
        this.saveBtn.textContent = 'Save Changes';
        this.saveBtn.style.display = 'block';
        this.populateForm(patientData);
        this.setFieldsReadonly(false);
        this.showModal();
    }
    
    // Show modal
    showModal() {
        this.modal.classList.remove('hidden');
    }
    
    // Close modal
    closeModal() {
        this.modal.classList.add('hidden');
        this.clearForm();
        this.currentMode = null;
        this.currentPatientData = null;
    }
    
    // Set form fields readonly
    setFieldsReadonly(readonly) {
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.readOnly = readonly;
            if (input.tagName === 'SELECT') {
                input.disabled = readonly;
            }
            
            // Add visual styling for readonly fields
            if (readonly) {
                input.style.backgroundColor = '#f8f9fa';
                input.style.cursor = 'not-allowed';
            } else {
                input.style.backgroundColor = '';
                input.style.cursor = '';
            }
        });
    }
    
    // Populate form with patient data
    populateForm(data) {
        document.getElementById('patientId').value = data.id || '';
        document.getElementById('patientName').value = data.name || '';
        document.getElementById('patientAge').value = data.age || '';
        document.getElementById('patientGender').value = data.gender || '';
        document.getElementById('lastVisit').value = data.lastVisit || '';
    }
    
    // Clear form
    clearForm() {
        this.form.reset();
        this.saveBtn.style.display = 'block';
    }
    
    // Handle form submission
    handleSubmit() {
        const formData = {
            id: document.getElementById('patientId').value,
            name: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            gender: document.getElementById('patientGender').value,
            lastVisit: document.getElementById('lastVisit').value
        };
        
        if (this.currentMode === 'add') {
            this.addPatient(formData);
        } else if (this.currentMode === 'edit') {
            this.updatePatient(formData);
        }
        
        this.closeModal();
    }
    
    // Add new patient (you can customize this)
    addPatient(data) {
        console.log('Adding patient:', data);
        alert('Patient added successfully!');
        // Add your logic to add patient to the table/database
        this.addPatientToTable(data);
    }
    
    // Update existing patient (you can customize this)
    updatePatient(data) {
        console.log('Updating patient:', data);
        alert('Patient updated successfully!');
        // Add your logic to update patient in the table/database
        this.updatePatientInTable(data);
    }
    
    // Add patient to table (example implementation)
    addPatientToTable(data) {
        const tableBody = document.querySelector('#patients .table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${data.id}</td>
            <td>${data.name}</td>
            <td>${data.age}</td>
            <td>${data.gender}</td>
            <td>${data.lastVisit}</td>
            <td>
                <button class="btn-view">View</button>
                <button class="btn-edit">Edit</button>
            </td>
        `;
        tableBody.appendChild(newRow);
        
        // Add event listeners to the new buttons
        newRow.querySelector('.btn-view').addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const patientData = extractPatientDataFromRow(row);
            patientModal.openViewMode(patientData);
        });
        
        newRow.querySelector('.btn-edit').addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const patientData = extractPatientDataFromRow(row);
            patientModal.openEditMode(patientData);
        });
    }
    
    // Update patient in table (example implementation)
    updatePatientInTable(data) {
        // Find the row with matching patient ID and update it
        const rows = document.querySelectorAll('#patients .table tbody tr');
        rows.forEach(row => {
            if (row.cells[0].textContent === data.id) {
                row.cells[1].textContent = data.name;
                row.cells[2].textContent = data.age;
                row.cells[3].textContent = data.gender;
                row.cells[4].textContent = data.lastVisit;
            }
        });
    }
}

// Initialize the modal manager
const patientModal = new PatientModal();

// Helper function to extract patient data from table row
function extractPatientDataFromRow(row) {
    const cells = row.querySelectorAll('td');
    return {
        id: cells[0].textContent,
        name: cells[1].textContent,
        age: cells[2].textContent,
        gender: cells[3].textContent,
        lastVisit: cells[4].textContent
    };
}

// Setup patient buttons
function setupPatientButtons() {
    // Add New Patient button
    document.querySelector('#patients .btn-primary').addEventListener('click', () => {
        patientModal.openAddMode();
    });
    
    // Update existing View buttons
    document.querySelectorAll('#patients .btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const patientData = extractPatientDataFromRow(row);
            patientModal.openViewMode(patientData);
        });
    });
    
    // Update existing Edit buttons
    document.querySelectorAll('#patients .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const patientData = extractPatientDataFromRow(row);
            patientModal.openEditMode(patientData);
        });
    });
}

class AppointmentModal {
  constructor() {
    this.modal = document.getElementById('appointmentModal');
    this.form = document.getElementById('appointmentForm');
    this.modalTitle = this.modal.querySelector('.modal-header h2');
    this.saveBtn = this.modal.querySelector('button[type="submit"]');
    this.currentMode = null;
    this.currentRow = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Close modal
    this.modal.querySelector('.close').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelApptBtn').addEventListener('click', () => this.closeModal());

    // Close when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === this.modal) this.closeModal();
    });

    // Handle submit
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  openAddMode() {
    this.currentMode = 'add';
    this.modalTitle.textContent = 'Add New Appointment';
    this.saveBtn.textContent = 'Save Appointment';
    this.clearForm();
    this.showModal();
  }

  openRescheduleMode(row) {
    this.currentMode = 'edit';
    this.currentRow = row;
    this.modalTitle.textContent = 'Reschedule Appointment';
    this.saveBtn.textContent = 'Save Changes';
    this.populateForm(row);
    this.showModal();
  }

  showModal() {
    this.modal.classList.remove('hidden');
  }

  closeModal() {
    this.modal.classList.add('hidden');
    this.clearForm();
    this.currentMode = null;
    this.currentRow = null;
  }

  populateForm(row) {
    const cells = row.querySelectorAll('td');
    document.getElementById('apptDate').value = cells[0].textContent.trim();
    document.getElementById('apptTime').value = this.convertTo24Hour(cells[1].textContent.trim());
    document.getElementById('apptPatient').value = cells[2].textContent.trim();
    document.getElementById('apptType').value = cells[3].textContent.trim();
    document.getElementById('apptStatus').value = cells[4].querySelector('.status-badge').textContent.trim();
  }

  clearForm() {
    this.form.reset();
  }

  handleSubmit() {
    const data = {
      date: document.getElementById('apptDate').value,
      time: document.getElementById('apptTime').value,
      patient: document.getElementById('apptPatient').value,
      type: document.getElementById('apptType').value,
      status: document.getElementById('apptStatus').value,
    };

    if (this.currentMode === 'add') {
      this.addAppointmentToTable(data);
    } else if (this.currentMode === 'edit') {
      this.updateAppointmentInTable(data);
    }

    this.closeModal();
  }

  addAppointmentToTable(data) {
    const tableBody = document.querySelector('#appointments .table tbody');
    const newRow = document.createElement('tr');

    const statusClass = this.getStatusClass(data.status);

    newRow.innerHTML = `
      <td>${data.date}</td>
      <td>${this.formatTime(data.time)}</td>
      <td>${data.patient}</td>
      <td>${data.type}</td>
      <td><span class="status-badge ${statusClass}">${data.status}</span></td>
      <td><button class="btn-resched">Resched</button></td>
    `;

    tableBody.appendChild(newRow);

    // Attach click event to new Resched button
    newRow.querySelector('.btn-resched').addEventListener('click', () => {
      appointmentModal.openRescheduleMode(newRow);
    });
  }

  updateAppointmentInTable(data) {
    if (!this.currentRow) return;
    const cells = this.currentRow.querySelectorAll('td');
    const statusClass = this.getStatusClass(data.status);

    cells[0].textContent = data.date;
    cells[1].textContent = this.formatTime(data.time);
    cells[2].textContent = data.patient;
    cells[3].textContent = data.type;
    cells[4].innerHTML = `<span class="status-badge ${statusClass}">${data.status}</span>`;
  }

  getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatTime(time) {
    // Convert "13:30" → "1:30 PM"
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  convertTo24Hour(timeStr) {
    // Convert "1:30 PM" → "13:30"
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) return timeStr;
    const [time, modifier] = timeStr.split(' ');
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);
    if (modifier === 'PM' && hour !== 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }
}

// Initialize appointment modal
const appointmentModal = new AppointmentModal();

// Setup appointment buttons
function setupAppointmentButtons() {
    document.querySelector('#appointments .btn-primary').addEventListener('click', () => {
        appointmentModal.openAddMode();
    });

    // Use a different class for appointment reschedule buttons to avoid conflict
    document.querySelectorAll('#appointments .btn-edit').forEach(btn => {
        // Change the class to btn-resched to avoid conflict with patient edit buttons
        btn.classList.remove('btn-edit');
        btn.classList.add('btn-resched');
        btn.textContent = 'Resched';
        
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            appointmentModal.openRescheduleMode(row);
        });
    });
}

class PrescriptionModal {
  constructor() {
    this.modal = document.getElementById('prescriptionModal');
    this.form = document.getElementById('prescriptionForm');
    this.modalTitle = this.modal.querySelector('.modal-header h2');
    this.saveBtn = this.modal.querySelector('button[type="submit"]');

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.modal.querySelector('.close').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelPrescBtn').addEventListener('click', () => this.closeModal());

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === this.modal) this.closeModal();
    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  openAddMode() {
    this.modalTitle.textContent = 'Add New Prescription';
    this.saveBtn.textContent = 'Save Prescription';
    this.clearForm();
    this.showModal();
  }

  showModal() {
    this.modal.classList.remove('hidden');
  }

  closeModal() {
    this.modal.classList.add('hidden');
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
  }

  handleSubmit() {
    const data = {
      date: document.getElementById('prescDate').value,
      patient: document.getElementById('prescPatient').value,
      medication: document.getElementById('prescMedication').value,
      dosage: document.getElementById('prescDosage').value,
      duration: document.getElementById('prescDuration').value,
      status: document.getElementById('prescStatus').value,
    };

    this.addPrescriptionToTable(data);
    this.closeModal();
  }

  addPrescriptionToTable(data) {
    const tableBody = document.querySelector('#prescriptions .table tbody');
    const newRow = document.createElement('tr');
    const statusClass = this.getStatusClass(data.status);

    newRow.innerHTML = `
      <td>${this.formatDate(data.date)}</td>
      <td>${data.patient}</td>
      <td>${data.medication}</td>
      <td>${data.dosage}</td>
      <td>${data.duration}</td>
      <td><span class="status-badge ${statusClass}">${data.status}</span></td>
    `;

    tableBody.appendChild(newRow);
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}

// Initialize prescription modal
const prescriptionModal = new PrescriptionModal();

// Setup Add Prescription button
function setupPrescriptionButtons() {
    document.querySelector('#prescriptions .btn-primary').addEventListener('click', () => {
        prescriptionModal.openAddMode();
    });
}

// Your existing navigation functions
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    document.getElementById(pageId).classList.remove('hidden');
    event.target.classList.add('active');
    
    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-open');
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 1024 && 
        !sidebar.contains(event.target) && 
        !menuBtn.contains(event.target)) {
        sidebar.classList.remove('mobile-open');
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupPatientButtons();
    setupAppointmentButtons();
    setupPrescriptionButtons();
});

const searchInput = document.getElementById('historySearchInput');
const searchButton = document.getElementById('historySearchBtn');
const tableBody = document.querySelector('#medicalHistoryTable tbody');
const originalRows = Array.from(tableBody.querySelectorAll('tr')); // Store original rows

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Clear table first
    tableBody.innerHTML = '';

    // Filter rows
    const filteredRows = originalRows.filter(row => {
        const cells = row.querySelectorAll('td');
        return Array.from(cells).some(cell =>
            cell.textContent.toLowerCase().includes(searchTerm)
        );
    });

    // Append matching rows or show "No results"
    if (filteredRows.length > 0) {
        filteredRows.forEach(row => tableBody.appendChild(row));
    } else {
        const noResultRow = document.createElement('tr');
        noResultRow.innerHTML = `<td colspan="5" style="text-align:center; color:gray;">No records found</td>`;
        tableBody.appendChild(noResultRow);
    }
});