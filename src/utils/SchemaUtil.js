import * as yup from "yup";

// Assuming dynamicSchema is generating the schema dynamically based on fields
export const dynamicSchema = (fields) => {
  const schemaFields = {};

  fields.forEach((field) => {
    if (field.type === "select") {
      schemaFields[field.name] = yup
        .string()
        .required(`${field.label} is required`);
    } else if (field.type === "text") {
      schemaFields[field.name] = yup
        .string()
        .required(`${field.label} is required`);
    } else if (field.type === "number") {
      schemaFields[field.name] = yup
        .number()
        .required(`${field.label} is required`)
        .typeError(`${field.label} must be a valid number`);
    } else if (field.type === "date") {
      schemaFields[field.name] = yup
        .date()
        .required(`${field.label} is required`)
        .typeError(`${field.label} must be a valid date`);
    }
  });

  return yup.object().shape(schemaFields);
};
