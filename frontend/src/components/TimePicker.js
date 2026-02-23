import React, { useState, useEffect } from "react";

function TimePicker({ date, setDate }) {
  const [localDate, setLocalDate] = useState("");
  const [hours, setHours] = useState("09");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [period, setPeriod] = useState("AM");

  // When component mounts or date changes, sync values
  useEffect(() => {
    if (!date) return;

    const d = new Date(date);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    setLocalDate(`${yyyy}-${mm}-${dd}`);

    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");

    const p = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;

    setHours(String(h).padStart(2, "0"));
    setMinutes(m);
    setSeconds(s);
    setPeriod(p);
  }, [date]);

  const updateParentDate = (
    newDate = localDate,
    h = hours,
    m = minutes,
    s = seconds,
    p = period
  ) => {
    if (!newDate) return;

    let hour24 = parseInt(h, 10);

    if (p === "PM" && hour24 !== 12) hour24 += 12;
    if (p === "AM" && hour24 === 12) hour24 = 0;

    const fullDate = new Date(
      `${newDate}T${String(hour24).padStart(2, "0")}:${m}:${s}`
    );

    setDate(fullDate);
  };

  return (
    <div className="exam-picker">
      {/* DATE */}
      <div className="picker-block">
        <input
          type="date"
          value={localDate}
          onChange={(e) => {
            setLocalDate(e.target.value);
            updateParentDate(e.target.value);
          }}
        />
      </div>

      {/* TIME */}
      <div className="picker-block">

        <div className="time-row">
          <input
            type="number"
            min="1"
            max="12"
            value={hours}
            onChange={(e) => {
              let val = e.target.value.padStart(2, "0");
              setHours(val);
              updateParentDate(localDate, val);
            }}
          />

          <span>:</span>

          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => {
              let val = e.target.value.padStart(2, "0");
              setMinutes(val);
              updateParentDate(localDate, hours, val);
            }}
          />

          <span>:</span>

          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => {
              let val = e.target.value.padStart(2, "0");
              setSeconds(val);
              updateParentDate(localDate, hours, minutes, val);
            }}
          />

          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              updateParentDate(localDate, hours, minutes, seconds, e.target.value);
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TimePicker;
