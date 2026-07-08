import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToDoctorQueue, updateAppointmentStatus } from "../clinicService";

const DoctorDashboard = () => {
  const { currentUser } = useAuth(); // Restoring dynamic user credentials tracking
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    // Open a direct, live data stream listener thread with Firestore
    const unsubscribe = subscribeToDoctorQueue(currentUser.uid, (result) => {
      if (result.success) {
        setAppointments(result.appointments);
        setError(null);
      } else {
        setError("Live connection stream failed: " + result.error);
      }
      setLoading(false);
    });

    // Automatically disconnect stream when doctor navigates away
    return () => unsubscribe();
  }, [currentUser]);

  // Handle manual queue lifecycle transformations instantly
  const handleStatusChange = async (appointmentId, nextStatus) => {
    setActionLoading(true);
    const result = await updateAppointmentStatus(appointmentId, nextStatus);
    if (!result.success) {
      setError("Failed to advance queue status parameters: " + result.error);
    }
    setActionLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>👨‍⚕️ Doctor Dashboard (Live Control Console)</h1>
      <p style={{ marginBottom: "25px", color: "#555" }}>
        Welcome, Dr. <strong>{currentUser?.email || "Authenticated User"}</strong>
      </p>

      {loading && <p>Connecting live database streams...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          {appointments.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No appointments found in queue timelines for today.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Queue #</th>
                  <th style={styles.th}>Patient Name</th>
                  <th style={styles.th}>Time Slot</th>
                  <th style={styles.th}>Status Key</th>
                  <th style={styles.th}>Actions Console</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} style={styles.tr}>
                    <td style={styles.td}>{appointment.queueNumber}</td>
                    <td style={styles.td}>{appointment.patientName}</td>
                    <td style={styles.td}>{appointment.timeSlot}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.status, ...getStatusStyle(appointment.status) }}>
                        {appointment.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          disabled={actionLoading || appointment.status === "active"}
                          onClick={() => handleStatusChange(appointment.id, "active")}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            backgroundColor: appointment.status === "active" ? "#bdc3c7" : "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "4px"
                          }}
                        >
                          {appointment.status === "active" ? "Active Now" : "Call Next"}
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusChange(appointment.id, "completed")}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            backgroundColor: "#27ae60",
                            color: "white",
                            border: "none",
                            borderRadius: "4px"
                          }}
                        >
                          Complete Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

// --- Kept your partner's helper functions exactly as they were written ---
const getStatusStyle = (status) => {
  switch (status) {
    case "pending": return { color: "#f39c12", backgroundColor: "#fcf3cf" };
    case "completed": return { color: "#27ae60", backgroundColor: "#eafaf1" };
    case "cancelled": return { color: "#c0392b", backgroundColor: "#fdedec" };
    default: return { color: "#7f8c8d", backgroundColor: "#f2f3f4" };
  }
};

// --- Kept your partner's layout styling object parameter definitions intact ---
const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: "#2c3e50",
    marginBottom: "5px",
  },
  error: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 3px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#3498db",
    color: "white",
    textAlign: "left",
    padding: "12px 15px",
    fontWeight: "bold",
  },
  td: {
    borderBottom: "1px solid #e1e1e1",
    padding: "10px 15px",
    color: "#333",
  },
  tr: {
    backgroundColor: "white",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "0.8em",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
};

export default DoctorDashboard;