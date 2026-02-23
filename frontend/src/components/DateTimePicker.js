import React from "react";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function convert12To24(hour, period) {
  if (period === "PM" && hour < 12) return hour + 12;
  if (period === "AM" && hour === 12) return 0;
  return hour;
}

function display12Hour(hour) {
  if (hour === 0) return 12;
  if (hour > 12) return hour - 12;
  return hour;
}

export default function DateTimePicker({ value, onChange }) {
  const date = value ? new Date(value) : new Date();

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hour24 = date.getHours();
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = display12Hour(hour24);

  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const update = (newParts) => {
    const newDate = new Date(date);

    if (newParts.date) {
      newDate.setFullYear(newParts.date.getFullYear());
      newDate.setMonth(newParts.date.getMonth());
      newDate.setDate(newParts.date.getDate());
    }

    if (newParts.time) {
      newDate.setHours(newParts.time.hours);
      newDate.setMinutes(newParts.time.minutes);
      newDate.setSeconds(newParts.time.seconds);
    }

    onChange(newDate);
  };

  return (
    <div className="datetime-wrapper">

      {/* DATE PICKER */}
      <input
        type="date"
        value={`${year}-${month}-${day}`}
        onChange={(e) => {
          const selected = new Date(e.target.value);
          update({ date: selected });
        }}
        className="datetime-input"
      />

      {/* TIME PICKER */}
      <div className="time-row">
        <input
          type="number"
          min="1"
          max="12"
          value={hour12}
          onChange={(e) => {
            const h = convert12To24(Number(e.target.value), period);
            update({
              time: {
                hours: h,
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
              }
            });
          }}
          className="datetime-input small"
        />

        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) =>
            update({
              time: {
                hours: date.getHours(),
                minutes: Number(e.target.value),
                seconds: date.getSeconds()
              }
            })
          }
          className="datetime-input small"
        />

        <select
          value={period}
          onChange={(e) => {
            const h = convert12To24(hour12, e.target.value);
            update({
              time: {
                hours: h,
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
              }
            });
          }}
          className="datetime-input small"
        >
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
    </div>
  );
}