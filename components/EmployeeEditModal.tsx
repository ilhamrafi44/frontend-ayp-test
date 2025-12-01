// components/EmployeeEditModal.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import type { Employee } from "@/types";
import { Modal } from "./Modal";
import { ToggleSwitch } from "./ToggleSwitch";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSaved: (updated: Employee) => void;
}

export const EmployeeEditModal: React.FC<Props> = ({
  open,
  employee,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill ketika employee berubah
  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setIsActive(employee.isActive);
      setError(null);
      setLoading(false);
    }
  }, [employee]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setLoading(true);
    setError(null);

    try {
      const updated = await apiFetch<Employee>(`/employees/${employee.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, email, isActive }),
      });

      onSaved(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="stack-md">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="card-title">Update employee</div>
            <div className="card-subtitle">
              Quickly edit basic details and activation status.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="stack-md">
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Status</label>
            <ToggleSwitch
              checked={isActive}
              onChange={setIsActive}
              label={isActive ? "Active" : "Inactive"}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.6rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
