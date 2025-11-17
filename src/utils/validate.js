
// src/utils/validate.js
export function validateHike(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Name is required';
  if (!values.location?.trim()) errors.location = 'Location is required';
  if (!values.date?.trim()) errors.date = 'Date is required';
  if (values.parking === undefined || values.parking === null) errors.parking = 'Parking is required';
  if (values.length === undefined || values.length === null || isNaN(Number(values.length)) || Number(values.length) <= 0) {
    errors.length = 'Length must be > 0';
  }
  if (!values.difficulty?.trim()) errors.difficulty = 'Difficulty is required';
  return errors;
}
