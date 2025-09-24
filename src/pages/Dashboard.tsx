import React, { useEffect, useState } from 'react';
import { ReactTabulator } from "react-tabulator";
import type { ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/tabulator.min.css";
import dayjs from "dayjs";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Request {
  id: string;
  requestStatus: string;
  requestType: string;
  requestor: string;
  requestDate: string;
  projectName: string;
}

const DEFAULT_USER = "kbinmuhammad"; 

const Dashboard: React.FC = () => {
  const [rows, setRows] = useState<Request[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    fetch(`${API_BASE}/api/requests`)
      .then(res => res.json())
      .then(data => {
        // Filter requests for default user
        const userRows = (data.rows || []).filter(
          (r: Request) => r.requestor === DEFAULT_USER
        );
        setRows(userRows);
      })
      .catch(console.error);
  }, []);

  const columns: ColumnDefinition[] = [
    { title: "ID", field: "id", width: 100 },
    { title: "Status", field: "requestStatus", width: 120 },
    { title: "Type", field: "requestType", width: 120 },
    { title: "Project", field: "projectName", width: 200 },
    {
      title: "Request Date",
      field: "requestDate",
      formatter: (cell) => dayjs(cell.getValue()).format("MM/DD/YYYY"),
      width: 140
    }
  ];

  const options = {
    layout: "fitDataStretch",
    pagination: "local" as const,
    paginationSize: pageSize,
    movableColumns: true,
  };

  const countByStatus = (status: string) =>
    rows.filter(r => r.requestStatus === status).length;

  return (
    <div style={{ padding: 16, background: "#020817", minHeight: "100vh", color: "#fff", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Welcome, {DEFAULT_USER}</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={summaryCardStyle}>
          <div style={summaryTitle}>Total Requests</div>
          <div style={summaryValue}>{rows.length}</div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryTitle}>Completed</div>
          <div style={{ ...summaryValue, color: "#4ade80" }}>{countByStatus("COMPLETED")}</div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryTitle}>In Progress</div>
          <div style={{ ...summaryValue, color: "#60a5fa" }}>{countByStatus("IN-PROGRESS")}</div>
        </div>
        <div style={summaryCardStyle}>
          <div style={summaryTitle}>Issues</div>
          <div style={{ ...summaryValue, color: "#f87171" }}>{countByStatus("ISSUE")}</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#020817", borderRadius: 12, padding: 4 }}>
        <ReactTabulator
          data={rows}
          columns={columns}
          options={options}
          className="dark-tabulator"
        />
      </div>
    </div>
  );
};

const summaryCardStyle: React.CSSProperties = {
  flex: "1 1 150px",
  background: "#111827",
  borderRadius: 8,
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
};

const summaryTitle: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  marginBottom: 4,
  textTransform: "uppercase",
};

const summaryValue: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
};

export default Dashboard;
