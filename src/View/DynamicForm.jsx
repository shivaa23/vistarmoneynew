import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Box,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import ModalFooter from "../modals/ModalFooter";

const DynamicForm = ({
  options = [],
  textFields = [],
  onSubmit,
  roles,
  fields = [],
  getFields,
  defaultRole = "",
}) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      role: defaultRole,
    },
  });
  console.log("defaultRole", defaultRole);

  const [districts, setDistricts] = useState([]);
  const selectedState = watch("state");
  const [selectedRole, setSelectedRole] = useState();
  const [request, setRequest] = useState([]);

  const prevRoleRef = useRef("");

  const fetchDistricts = async (stateCode) => {
    postJsonData(
      ApiEndpoints.GET_DISTRICTS,
      { state_code: stateCode },
      setRequest,
      (res) => {
        const data = res.data.data;
        setDistricts(data);
        // console.log("the state dat is a ", data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedRole && selectedRole !== prevRoleRef.current) {
      getFields({ role: selectedRole });
      prevRoleRef.current = selectedRole;
    }
  }, [selectedRole, getFields]);

  const handleFormSubmit = (data) => {
    getFields(data);
    console.log("Form fields:", data);
    reset();
  };

  return (
    <form style={{ width: "100%" }}>
      {roles && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="dropdown-label">Select Role</InputLabel>
          <Controller
            name="role"
            control={control}
            defaultValue={defaultRole.toUpperCase()}
            render={({ field }) => (
              <Select
                {...field}
                labelId="dropdown-label"
                label="Select Role"
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  field.onChange(e.target.value.toUpperCase());
                }}
                value={selectedRole}
              >
                {console.log("the selectedRole is", selectedRole)}
                {options && options.length > 0 ? (
                  options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.key}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No options available</MenuItem>
                )}
              </Select>
            )}
          />
        </FormControl>
      )}

      {/* Dynamic Fields - Render based on selected role */}
      {selectedRole &&
        fields.map((field, index) => {
          if (field.type === "number" || field.type === "string") {
            return (
              <Box key={field.key || index} marginBottom={2}>
                <Controller
                  name={field.key}
                  control={control}
                  defaultValue=""
                  rules={{
                    required: `${field.key} is required`,
                    pattern: field.regex
                      ? {
                          value: new RegExp(field.regex),
                          message: `Invalid ${field.key} format`,
                        }
                      : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      label={field.key}
                      fullWidth
                      error={!!errors[field.key]}
                      helperText={errors[field.key]?.message || ""}
                    />
                  )}
                />
              </Box>
            );
          }

          if (field.type === "drop" && Array.isArray(field.values)) {
            return (
              <Box key={field.key || index} marginBottom={2}>
                <Controller
                  name={field.key}
                  control={control}
                  defaultValue=""
                  render={({ field: controllerField }) => (
                    <FormControl fullWidth>
                      <InputLabel>{field.key}</InputLabel>
                      <Select {...controllerField} label={field.key}>
                        {field.values.length > 0 ? (
                          field.values.map((option, optionIndex) => (
                            <MenuItem
                              key={optionIndex}
                              value={option.state_code}
                            >
                              {option.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No options available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            );
          }

          return null;
        })}
      {districts.length > 0 && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="district-label">Select District</InputLabel>
          <Controller
            name="district"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                labelId="district-label"
                label="Select District"
              >
                {districts.map((district, index) => (
                  <MenuItem key={index} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      )}

      {/* Submit Button */}
      <ModalFooter onClick={handleSubmit(handleFormSubmit)}>Submit</ModalFooter>
    </form>
  );
};

export default DynamicForm;
