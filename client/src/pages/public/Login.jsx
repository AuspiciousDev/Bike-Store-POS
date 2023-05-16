import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Button,
  Checkbox,
} from "@mui/material";
import {
  LockOutlined,
  PersonOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { tokens } from "../../themes";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import LoadingDialogue from "../../global/LoadingDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { auth, setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formError, setFormError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const style = {
    borderRadius: 2,
    marginTop: 2,
    "&:hover": {
      transition: "0.5s",
      filter: "drop-shadow(0 2em 3em #61a1d7)",
    },
  };
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    if (!usernameError && !passwordError) {
      setLoadingDialog({ isOpen: true });
      try {
        const apiLogin = await axios.post(
          "/auth/login",
          JSON.stringify({ username, password })
        );
        if (apiLogin.status === 200) {
          setUsername("");
          setPassword("");
          const parseData = apiLogin?.data;
          const userType = parseData?.userType;

          console.log(
            "🚀 ~ file: Login.jsx:95 ~ handleSubmit ~ userType",
            userType
          );
          const accessToken = parseData?.accessToken;
          const firstName = parseData?.firstName;
          const lastName = parseData?.lastName;
          setAuth({ username, userType, accessToken, firstName, lastName });

          from === "/" && userType === "admin"
            ? navigate("/admin", { replace: true })
            : from === "/" && userType === "employee"
            ? navigate("/employee", { replace: true })
            : navigate(from, { replace: true });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Login.jsx:109 ~ handleSubmit ~ error", error);
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
      }
    }
  };
  return (
    <Box
      className="container-center-all"
      sx={{
        padding: 2,
        background:
          " linear-gradient(63deg, rgba(97,161,215,1) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <img className="logo" alt="logo" src={logo} />
      <Paper className="smallForm-center" sx={style}>
        <Typography
          variant="h2"
          sx={{
            mb: 5,
            borderLeft: `5px solid ${colors.primary[900]}`,
            paddingLeft: 2,
            alignSelf: "start",
          }}
        >
          Welcome back!
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={formStyle}>
            <TextField
              required
              label="Username"
              variant="outlined"
              autoComplete="off"
              error={usernameError}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(false);
                setPasswordError(false);
                setFormError(false);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined />
                    <Divider
                      sx={{ height: 30, m: 0.5 }}
                      orientation="vertical"
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              autoComplete="off"
              error={passwordError}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setUsernameError(false);
                setPasswordError(false);
                setFormError(false);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                    <Divider
                      sx={{ height: 30, m: 0.5 }}
                      orientation="vertical"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      sx={{
                        "& > svg": {
                          fontSize: "18px",
                          color: colors.primary[500],
                        },
                      }}
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
            />
          </Box>
          <Typography color="error" variant="subtitle2">
            {formError && formErrorMessage}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              "& > a": {
                color: colors.primary[500],
                textDecoration: "none",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={persist}
                onChange={togglePersist}
                sx={{ height: "5px", width: "5px", mr: 1 }}
                color="primary"
              />

              <label htmlFor="persist">Remember me</label>
            </Box>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Box>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ borderRadius: 4, height: 45, mt: "2em" }}
          >
            <Typography variant="h5" fontWeight="500" color="white">
              Login
            </Typography>
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
