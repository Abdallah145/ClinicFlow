import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  subscribeToDoctorQueue, 
  updateAppointmentStatus, 
  saveMedicalRecord 
} from "../clinicService";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Examination Form States
  const [activePatient, setActivePatient] = useState(null); // Tracks the full patient object being examined
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  // 1. Establish Real-Time Open Socket Stream Listener
  useEffect(() => {
    if (!currentUser?.uid) return;

    // Open connection to Firestore snapshot query stream
    const unsubscribe = subscribeToDoctorQueue(currentUser.uid, (result) => {
      if (result.success) {
        setQueue(result.appointments);
        setError(""); // Clear old connection errors
      } else {
        setError(result.error);
      }
      // setQueueLoading(false);
      setLoading(false);
    });

    // Automatically cut socket collection channel on component unmount
    return () => unsubscribe();
  }, [currentUser]);

  // 2. Control Queue State Lifecycle Transitions
  const handleStatusChange = async (appointmentId, nextStatus) => {
    setActionLoading(true);
    setError("");
    
    const result = await updateAppointmentStatus(appointmentId, nextStatus);
    
    if (!result.success) {
      setError(result.error);
    }
    setActionLoading(false);
  };

  // 3. Persist Medical History Log Profiles
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!activePatient || !diagnosis.trim()) return;

    setActionLoading(true);
    setError("");

    // Package standard appointment history session entry
    const medicalPayload = {
      history: [{
        date: new Date().toLocaleDateString(),
        doctorId: currentUser.uid,
        doctorName: currentUser.name || "Doctor",
        diagnosis: diagnosis.trim(),
        prescription: prescription.trim() || "None Prescribed"
      }]
    };

    const result = await saveMedicalRecord(activePatient.patientId, medicalPayload);
    
    if (result.success) {
      // Clear out clinical panel state maps on success
      setDiagnosis("");
      setPrescription("");
      setActivePatient(null);
      alert("Clinical diagnostic file updated successfully!");
    } else {
      setError(result.error);
    }
    setActionLoading(false);
  };

  if (loading) return <div style={{ padding: "20px" }}>Initializing live database streams...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Clinical Command Control Center</h2>
      <p>Welcome, Dr. {currentUser?.name || "User"}</p>
      
      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
          <strong>System Alert:</strong> {error}
        </div>
      )}
      
      <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
        
        {/* LEFT COMPONENT COLUMN: LIVE PATIENT QUEUE TRACKER */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Live Patient Traffic Line ({queue.length})</h3>
          <hr />
          
          {queue.length === 0 ? (
            <p style={{ color: "#666" }}>No patients currently waiting in queue timeline fields.</p>
          ) : (
            queue.map((appt) => (
              <div 
                key={appt.id} 
                style={{ 
                  border: "1px solid #ccc", 
                  borderRadius: "6px", 
                  padding: "15px", 
                  margin: "12px 0",
                  backgroundColor: appt.status === "active" ? "#eff6ff" : "#fff",
                  borderColor: appt.status === "active" ? "#3b82f6" : "#ccc"
                }}
              >
                <h4>Patient: {appt.patientName}</h4>
                <p><strong>Queue Order Placement Position:</strong> #{appt.queueNumber}</p>
                <p><strong>Tracking Ticket Code Reference:</strong> {appt.id}</p>
                <p><strong>Status Key Tag:</strong> <span style={{ color: appt.status === "active" ? "#2563eb" : "#d97706" }}>{appt.status.toUpperCase()}</span></p>
                
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button 
                    disabled={actionLoading || appt.status === "active"}
                    onClick={() => handleStatusChange(appt.id, "active")}
                    style={{ padding: "6px 12px", cursor: "pointer" }}
                  >
                    Call Next Patient
                  </button>
                  
                  <button 
                    disabled={actionLoading}
                    onClick={() => {
                      // Move appointment status to completed, and unlock the record form window
                      setActivePatient(appt);
                      handleStatusChange(appt.id, "completed");
                    }}
                    style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    Examine & Complete Close
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COMPONENT COLUMN: ACTIVE HISTORICAL EXAMINATION FORM DESK */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {activePatient ? (
            <div style={{ border: "2px solid #059669", borderRadius: "8px", padding: "20px", backgroundColor: "#f0fdf4" }}>
              <h3>Prescription Desk: File Session Update Entry</h3>
              <p><strong>Current Active Patient Profile:</strong> {activePatient.patientName}</p>
              <p><strong>ID Reference Payload:</strong> {activePatient.patientId}</p>
              <hr />
              
              <form onSubmit={handleRecordSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Diagnosis Notes:</label>
                  <textarea 
                    rows="4"
                    required
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    placeholder="Enter explicit diagnostic medical review profiles..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Prescriptions / Action Treatments:</label>
                  <input 
                    type="text" 
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    placeholder="e.g., Amoxicillin 500mg - 3x Daily"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}
                  >
                    {actionLoading ? "Saving Log Data Record..." : "Lock Diagnostics & Save History Log"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActivePatient(null)}
                    style={{ padding: "10px 15px", cursor: "pointer", backgroundColor: "#e11d48", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    Cancel Desk Form
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ border: "1px dashed #aaa", borderRadius: "8px", padding: "40px", textAlign: "center", color: "#666", marginTop: "40px" }}>
              Select "Examine & Complete Close" on an active queue list client token card to pull open case session form parameters here.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;