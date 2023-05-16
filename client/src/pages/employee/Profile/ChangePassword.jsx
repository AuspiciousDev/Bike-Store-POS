import React from "react";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  FastfoodOutlined,
} from "@mui/icons-material";
import { tokens } from "../../../themes";
import useAuth from "../../../hooks/useAuth";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import { useNavigate, useLocation, Link } from "react-router-dom";

const ChangePassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);

  const clearFields = () => {
    setOldPassword("");
    setPassword("");
    setConfPassword("");
  };
  const changePassword = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (password !== confPassword) {
      return (
        setPasswordError(true),
        setConfPasswordError(true),
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({
          isOpen: true,
          message: `Password doesn't match!`,
        })
      );
    }
    const data = {
      username: auth.username,
      password: oldPassword,
      newPassword: password,
    };
    try {
      if (!oldPasswordError && !passwordError && !confPasswordError) {
        const response = await axiosPrivate.post(
          "/auth/change-password",
          JSON.stringify(data)
        );

        if (response.status === 200) {
          const json = await response.data;
          console.log("response;", json);
          setOldPassword("");
          setPassword("");
          setConfPassword("");
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            // message: `Registration of ${json.userType} - ${json.username} Success!`,
            message: `${json.message}`,
          });
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `No server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setOldPasswordError(true);
        setPasswordError(true);
        setConfPasswordError(true);
        setConfPassword("");
        setPassword("");
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 409) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 500) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  return (
    <Box className="contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper
        className="contents-body"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box className="contents-header">
          <Typography
            variant="h1"
            textTransform="uppercase"
            sx={{
              paddingLeft: "0.3em",
              borderLeft: `solid 5px ${colors.primary[500]}`,
            }}
            fontWeight="700"
          >
            CHANGE PASSWORD
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Box width="100%">
            <form onSubmit={changePassword} style={{ width: "100%" }}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ width: { xs: "100#", sm: "30%" } }}
              >
                <TextField
                  required
                  type={showOldPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="Current Password"
                  value={oldPassword}
                  error={oldPasswordError}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setOldPasswordError(false);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowOldPassword}
                          onMouseDown={handleMouseDownOldPassword}
                        >
                          {showOldPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={oldPasswordError ? "Invalid password" : ""}
                />
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="New Password"
                  value={password}
                  error={passwordError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={passwordError ? "Invalid password" : ""}
                />

                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="Confirm Password"
                  value={confPassword}
                  error={confPasswordError}
                  onChange={(e) => {
                    setConfPassword(e.target.value);
                    setConfPasswordError(false);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={confPasswordError ? "Invalid password" : ""}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    gap: 2,
                    mt: 2,
                    "& > button": {
                      width: "20em",
                      height: "4em",
                    },
                  }}
                >
                  <Button type="submit" variant="contained">
                    <Typography variant="h4">Submit</Typography>
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      clearFields();
                      navigate("/employee");
                    }}
                  >
                    <Typography variant="h4">Cancel</Typography>
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
