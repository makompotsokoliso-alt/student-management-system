import { useState } from "react";
import "./App.css";


const initialStudents = [
  {
    id: "1013456",
    name: "Nozuko",
    age: 22,
    email: "nozuko@gmail.com",
    course: "business management",
    status: "Enrolled",
  },
  {
    id: "1012345",
    name: "Siyabulela",
    age: 21,
    email: "siyabulela@gmail.com",
    course: "software engineering",
    status: "Enrolled",
  },
  {
    id:"1014567",
    name:"Nosphelo",
    age:30,
    email:"nosphelo@gmail.com",
    course:"infomation technology",
    status:"Enrolled", 
  },
];


function validateStudent(student) {
  if (
    !student.name.trim() ||
    !student.email.trim() ||
    !student.course.trim() ||
    !student.age ||
    !student.status
  ) {
    return "Please fill in all fields.";
  }

  if (Number(student.age) < 1 || Number(student.age) > 100) {
    return "Age must be between 16 and 100.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(student.email)) {
    return "Please enter a valid email address.";
  }

  return "";
}


function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(
    student || {
      name: "",
      age: "",
      email: "",
      course: "",
      status: "Enrolled",
    }
  );

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const message = validateStudent(form);

    if (message) {
      setError(message);
      return;
    }

    onSave({
      ...form,
      age: Number(form.age),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="student-modal-title">
          {student ? "Edit Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </label>

          <label>
            Age
            <input
              name="age"
              type="number"
              min="1"
              max="100"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              required
            />
          </label>

          <label>
            Email Address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </label>

          <label>
            Course of Study
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Enter course"
              required
            />
          </label>

          <label>
            Enrollment Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Enrolled">Enrolled</option>
              <option value="Pending">Pending</option>
              <option value="Graduated">Graduated</option>
            </select>
          </label>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              Save Student
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function StudentRow({ student, onEdit, onDelete }) {
  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.name}</td>
      <td>{student.age}</td>
      <td>{student.email}</td>
      <td>{student.course}</td>
      <td>
        <span className={`status ${student.status.toLowerCase()}`}>
          {student.status}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button
            className="edit-button"
            onClick={() => onEdit(student)}
          >
            Edit
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(student)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}


function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("studentRecords");

    return savedStudents
      ? JSON.parse(savedStudents)
      : initialStudents;
  });

  const [modalStudent, setModalStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  
  function updateStudents(updatedStudents) {
    setStudents(updatedStudents);
    localStorage.setItem(
      "studentRecords",
      JSON.stringify(updatedStudents)
    );
  }

  
  function saveStudent(student) {
    let updatedStudents;

    if (modalStudent) {
      updatedStudents = students.map((item) =>
        item.id === modalStudent.id
          ? { ...student, id: modalStudent.id }
          : item
      );
    } else {
      const nextNumber =
        students.reduce((highest, item) => {
          const number = Number(item.id.replace("ST", ""));
          return Math.max(highest, number);
        }, 0) + 1;

      const newStudent = {
        ...student,
        id: `ST${String(nextNumber).padStart(3, "0")}`,
      };

      updatedStudents = [...students, newStudent];
    }

    updateStudents(updatedStudents);
    setModalOpen(false);
    setModalStudent(null);
  }

  
  function openAddModal() {
    setModalStudent(null);
    setModalOpen(true);
  }

  
  function openEditModal(student) {
    setModalStudent(student);
    setModalOpen(true);
  }

  
  function confirmDelete() {
    if (!deleteStudent) return;

    const updatedStudents = students.filter(
      (student) => student.id !== deleteStudent.id
    );

    updateStudents(updatedStudents);
    setDeleteStudent(null);
  }

  
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();

    return (
      student.id.toLowerCase().includes(search) ||
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.course.toLowerCase().includes(search)
    );
  });

  
  const hasStudents = filteredStudents.length > 0;

  return (
    <main className="app-container">
      <header className="page-header">
        <div>
          <h1>Student Management System</h1>
          <p>Manage student records in one place.</p>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          + Add Student
        </button>
      </header>

      <section className="dashboard">
        <div className="dashboard-heading">
          <div>
            <h2>Student Dashboard</h2>
            <p>Total students: {students.length}</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search students"
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Email Address</th>
                <th>Course of Study</th>
                <th>Enrollment Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {hasStudents ? (
                filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onEdit={openEditModal}
                    onDelete={setDeleteStudent}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <StudentModal
          key={modalStudent ? modalStudent.id : "new-student"}
          student={modalStudent}
          onSave={saveStudent}
          onClose={() => {
            setModalOpen(false);
            setModalStudent(null);
          }}
        />
      )}

      {deleteStudent && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteStudent(null)}
        >
          <div
            className="modal confirmation-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-title">Delete Student?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteStudent.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="delete-button"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

              <button
                className="secondary-button"
                onClick={() => setDeleteStudent(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;