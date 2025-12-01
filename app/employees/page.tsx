// app/employees/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee, AuthUser } from "@/types";
import { apiFetch } from "@/lib/api";
import { clearAuth, getToken, getUser } from "@/lib/auth";
import { EmployeeEditModal } from "@/components/EmployeeEditModal";

export default function EmployeesPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auth & initial load
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (!token) {
      router.replace("/login");
      return;
    }

    setUser(storedUser);

    const load = async () => {
      try {
        const data = await apiFetch<Employee[]>("/employees");
        setEmployees(data);
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("unauthenticated")) {
          clearAuth();
          router.replace("/login");
        } else {
          setError(err.message || "Failed to load employees");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleOpenEdit = (employee: Employee) => {
    setSelected(employee);
    setModalOpen(true);
  };

  const handleSaved = (updated: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Employees</div>
            <div className="card-subtitle">
              Manage activation and details for up to 1,000 employees in a
              smooth, scrollable view.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user && (
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ color: "var(--text-main)", fontWeight: 500 }}>
                  {user.name}
                </div>
                <div>{user.email}</div>
              </div>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {loading && <div className="card-subtitle">Loading employees…</div>}
        {error && <div className="form-error">{error}</div>}

        {!loading && !error && (
          <div className="table-wrapper">
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ width: "140px" }}>Status</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>#{employee.id}</td>
                      <td>{employee.name}</td>
                      <td style={{ fontSize: "0.85rem" }}>{employee.email}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            employee.isActive
                              ? "status-pill--active"
                              : "status-pill--inactive"
                          }`}
                        >
                          <span className="status-dot" />
                          {employee.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {employee.isActive ? (
                          <button
                            className="btn btn-sm"
                            onClick={() => handleOpenEdit(employee)}
                          >
                            Update
                          </button>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            — disabled —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        <span className="card-subtitle">
                          No employees found.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <EmployeeEditModal
        open={modalOpen}
        employee={selected}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
