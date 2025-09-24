import { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import type { ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/tabulator.min.css";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

declare global {
  interface Window { XLSX: any }
}
window.XLSX = XLSX;

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RequestsDashboard() {
  const tableRef = useRef<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(50);

  const [detail, setDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/requests`)
      .then((r) => r.json())
      .then((j) => setRows(j.rows || []))
      .catch(console.error);
  }, []);

  // Dark theme styles
  useEffect(() => {
    if (!document.getElementById("tabulator-dark-theme")) {
      const s = document.createElement("style");
      s.id = "tabulator-dark-theme";
      s.textContent = `
        body {
          background-color: #020817 !important;
          color: #fff !important;
          font-family: "Segoe UI", sans-serif;
        }

        .dark-tabulator .tabulator,
        .dark-tabulator .tabulator .tabulator-tableholder {
          background: #020817 !important;
          color: #fff !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 12px !important;
        }

        .dark-tabulator .tabulator-header {
        background: #020817 !important;
        color: #fff !important;
        font-weight: 600;
        font-size: 12px !important; /* reduced from default 14-15px */
        border-bottom: 1px solid #444;
        border-radius: 12px 12px 0 0 !important;
        padding: 2px 4px !important; /* reduced padding */
      }
        .dark-tabulator .tabulator-col {
          background: #020817 !important;
          color: #fff !important;
          border-right: 1px solid #333;
        }

        .dark-tabulator .tabulator-row {
          background: #020817 !important;
          color: #fff !important;
          border: none !important;
          height: 28px !important;
        }

        .dark-tabulator .tabulator-row:hover {
          background: #2a3b66 !important;
          color: #fff !important;
        }

        .dark-tabulator .tabulator-cell {
          border: none !important;
          color: #fff !important;
          white-space: normal;
          padding: 4px 6px !important;
        }

        .dark-tabulator .tabulator-footer {
          background: #020817 !important;
          border-top: 1px solid #333;
          color: #fff !important;
          border-radius: 0 0 12px 12px !important;
        }

        .action-trigger, .action-item, .action-confirm,
        .dark-tabulator .tabulator-page, .dark-tabulator .tabulator-page-size {
          background: #020817 !important;
          color: #fff !important;
          border: 1px solid #333 !important;
          border-radius: 6px;
          padding: 4px 8px !important;
          font-size: 13px !important;
        }

        .action-menu {
          background: #020817 !important;
          border: 1px solid #333;
          border-radius: 6px;
          position: absolute;
          z-index: 10;
        }
      `;
      document.head.appendChild(s);
    }
  }, []);

  async function openDetail(id: string) {
    try {
      setDetailLoading(true);
      setDetail(null);
      const res = await fetch(`${API_BASE}/api/requests/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDetail(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load details.");
    } finally {
      setDetailLoading(false);
    }
  }

  const fmtDate = (v?: string | Date | null) =>
    v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "";

  const columns: ColumnDefinition[] = [
    {
      title: "ID",
      field: "id",
      headerFilter: "input",
      width: 80,
      formatter: (cell) => `<span style="color:#60a5fa;text-decoration:underline;cursor:pointer;">${cell.getValue()}</span>`,
      cellClick: (_e, cell) => openDetail(cell.getValue()),
    },
    {
      title: "Request Status",
      field: "requestStatus",
      headerFilter: "input",
      formatter: (cell) => {
        const v = cell.getValue();
        const cls =
          v === "ISSUE"
            ? "background-color:#ffe8cc;color:#a55300;"
            : v === "IN-PROGRESS"
            ? "background-color:#cce4ff;color:#0044cc;"
            : v === "COMPLETED"
            ? "background-color:#d4edda;color:#006b3a;"
            : "background-color:#2a3b66;color:#ddd;";
        return `<span style="padding:2px 6px;border-radius:6px;${cls}">${v}</span>`;
      },
    },
    { title: "QAWR", field: "qawrNumber", headerFilter: "input", width: 80 },
    { title: "Request Type", field: "requestType", headerFilter: "input" },
    { title: "Requestor", field: "requestor", headerFilter: "input" },
    { title: "Form Factor", field: "formFactor", headerFilter: "input", width: 100 },
    { title: "Project Name", field: "projectName", headerFilter: "input" },
    { title: "Request Date", field: "requestDate", sorter: "date", headerFilter: "input", width: 120, formatter: (c) => dayjs(c.getValue()).format("MM/DD/YYYY") },
    { title: "Priority", field: "qaPriorityCode", headerFilter: "input", width: 80 },
    { title: "Remarks", field: "remarks", headerFilter: "input" },
    {
      title: "Actions",
      field: "actions",
      width: 220,
      headerSort: false,
      frozen: true,
      formatter: (cell) => {
        const row = cell.getRow();
        const data = row.getData();

        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.gap = "4px";
        wrap.style.position = "relative";

        let selectedStatus = "";

        const trigger = document.createElement("button");
        trigger.className = "action-trigger";
        trigger.textContent = "Change status…";

        const menu = document.createElement("div");
        menu.className = "action-menu";
        menu.style.display = "none";

        ["COMPLETED", "IN-PROGRESS", "ISSUE"].forEach((val) => {
          const item = document.createElement("button");
          item.className = "action-item";
          item.textContent = val;
          item.addEventListener("click", () => {
            selectedStatus = val;
            trigger.textContent = val;
            btn.disabled = !selectedStatus || selectedStatus === data.requestStatus;
            menu.style.display = "none";
          });
          menu.appendChild(item);
        });

        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => (menu.style.display = "none"));

        const btn = document.createElement("button");
        btn.className = "action-confirm";
        btn.textContent = "Confirm";
        btn.disabled = true;

        btn.addEventListener("click", async () => {
          const status = selectedStatus;
          if (!status || status === data.requestStatus) return;
          btn.disabled = true;
          const prevText = btn.textContent;
          btn.textContent = "Saving…";
          try {
            const res = await fetch(`${API_BASE}/api/requests/${data.id}/status`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            row.update({ requestStatus: status });
            btn.textContent = "Saved";
            setTimeout(() => { btn.textContent = prevText!; }, 900);
          } catch (e) {
            console.error(e);
            btn.textContent = "Error";
            setTimeout(() => {
              btn.textContent = prevText!;
              btn.disabled = false;
            }, 1200);
          }
        });

        wrap.appendChild(trigger);
        wrap.appendChild(menu);
        wrap.appendChild(btn);

        return wrap;
      }
    }
  ];

  const options = {
    layout: "fitColumns",
    responsiveLayout: "collapse",
    rowHeight: 28,
    pagination: "local" as const,
    paginationSize: pageSize,
    paginationSizeSelector: [10, 25, 50, 100],
    movableColumns: true,
    reactiveData: true,
    headerFilterLiveFilter: true,
    columnDefaults: {
      widthGrow: 1,
      minWidth: 60
    }
  };

  const excel = () => tableRef.current?.table?.download("xlsx", "requests.xlsx", { sheetName: "Requests" });
  const copy = async () => {
    const data = tableRef.current?.table?.getData() ?? [];
    const cols = columns.map((c) => (c.field as string)).filter(Boolean);
    const tsv = [cols.join("\t"), ...data.map((r: any) => cols.map((k) => r[k] ?? "").join("\t"))].join("\n");
    await navigator.clipboard.writeText(tsv);
    alert("Copied table (TSV) to clipboard.");
  };
  const print = () => tableRef.current?.table?.print(false, true);

  return (
    <div style={{ padding:16, width:"100%", background:"#020817", minHeight:"100vh" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, position: "sticky", top: 0, background: "#020817", padding: 6, zIndex: 5, borderBottom: "1px solid #020817", borderRadius:4 }}>
        <button style={btnDark} onClick={copy}>Copy</button>
        <button style={btnDark} onClick={excel}>Excel</button>
        <button style={btnDark} onClick={print}>Print</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <label style={{color:"#f0f0f0"}}>Show</label>
          <select style={selectDark} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option>10</option><option>25</option><option>50</option><option>100</option>
          </select>
          <label style={{color:"#f0f0f0"}}>rows</label>
        </div>
        <input
          placeholder="Search…"
          onChange={(e) => {
            const table = tableRef.current?.table;
            if (!table) return;
            const q = e.target.value.toLowerCase();
            if (!q) return table.clearFilter(true);
            table.setFilter((row: any) =>
              Object.values(row.getData()).some((v: any) => String(v ?? "").toLowerCase().includes(q))
            );
          }}
          style={{ marginLeft: 8, padding: "4px 6px", width: 220, background: "#020817", color: "#f0f0f0", border: "1px solid #2a3b66", borderRadius: 6, fontSize: 13 }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", background: "#020817", borderRadius: 12, padding: 2 }}>
        <ReactTabulator className="dark-tabulator" data={rows} columns={columns} options={options} ref={tableRef} />
      </div>
    </div>
  );
}

const btnDark: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid #333",
  background: "#020817",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 13
};

const selectDark: React.CSSProperties = {
  background: "#020817",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 6,
  padding: "2px 4px",
  fontSize: 13
};
