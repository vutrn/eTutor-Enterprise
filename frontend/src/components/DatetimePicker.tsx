import React, { useState, useEffect, useRef } from "react";
import { View, Button, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import flatpickr from "flatpickr";

export const DatetimePicker = ({ value, onChange }: any) => {
  const [date, setDate] = useState(value || new Date());
  const [show, setShow] = useState(false);
  const flatpickrRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === "web" && flatpickrRef.current) {
      flatpickrInstance.current = flatpickr(flatpickrRef.current, {
        enableTime: true,
        dateFormat: "M d, Y H:i",
        defaultDate: date,
        onChange: (selectedDates) => {
          const newDate = selectedDates[0];
          setDate(newDate);
          onChange(newDate);
        },
        // allowInput: true,
      });

      return () => {
        // Clean up flatpickr instance when component unmounts
        if (flatpickrInstance.current) {
          flatpickrInstance.current.destroy();
        }
      };
    }
  }, []);

  const onDateChange = ({
    event,
    selectedDate,
  }: {
    event: any;
    selectedDate: Date | undefined;
  }) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Keep picker open on iOS, close on others
    setDate(currentDate);
    onChange(currentDate);
  };

  return (
   
      <input
        ref={flatpickrRef}
        type="text"
        placeholder="Select Date & Time"
        className="flatpickr-input"
        style={styles.webInput}
        readOnly
      />
 
  );
};

const styles = StyleSheet.create({
  webInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    width: "100%",
    cursor: "pointer",
  },
});
