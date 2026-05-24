"use client";

import { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { Activity } from "@/lib/mock-data";
import Toast from "@/components/common/Toast";

interface AddToAgendaModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToAgendaModal({
  activity,
  isOpen,
  onClose,
}: AddToAgendaModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(
    activity.schedules[0]
      ? `${activity.schedules[0].startTime}-${activity.schedules[0].endTime}`
      : ""
  );
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  function handleConfirm() {
    setShowToast(true);
    setTimeout(() => {
      onClose();
      setShowToast(false);
      setSelectedDate("");
    }, 1500);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-ink">Añadir a mi agenda</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-sand transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-ink mb-1">Actividad</p>
              <p className="text-base font-display font-bold text-ink">{activity.title}</p>
            </div>

            <div>
              <label
                htmlFor="date-input"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Fecha
              </label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {activity.schedules.length > 1 && (
              <div>
                <p className="text-sm font-medium text-ink mb-1.5">Horario</p>
                <div className="flex flex-wrap gap-2">
                  {activity.schedules.map((s) => {
                    const val = `${s.weekday}-${s.startTime}-${s.endTime}`;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedSchedule(val)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          selectedSchedule === val
                            ? "bg-primary text-white border-primary"
                            : "border-border text-ink-light hover:border-primary hover:text-primary"
                        }`}
                      >
                        {s.weekday} {s.startTime}–{s.endTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 pt-0 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-border text-sm font-medium text-ink-light hover:bg-sand transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={`"${activity.title}" añadida a tu agenda ✓`}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
