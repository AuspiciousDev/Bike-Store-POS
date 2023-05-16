import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { format } from "date-fns-tz";
import {
  AdminPanelSettings,
  BadgeOutlined,
  Edit,
  ModeEditOutlineOutlined,
  MoreVert,
} from "@mui/icons-material";

import { useTheme, styled } from "@mui/material";
import { tokens } from "../../../themes";
import PropTypes from "prop-types";
import logo from "../../../assets/logo.png";
import useAuth from "../../../hooks/useAuth";
const UserProfile = (props) => {
  const { username } = useParams();
  const [getUserDetails, setUserDetails] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/users/${auth.username}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log("Employees GET : ", json);
          setLoadingDialog({ isOpen: false });
          setUserDetails(json);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: UserProfile.jsx:64 ~ getUsersDetails ~ error",
          error
        );
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate(-1);
          console.log(error.response.data.message);
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
        setLoadingDialog({ isOpen: false });
      }
    };
    getUsersDetails();
  }, []);

  const SetUserDetails = () => {
    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "row",
          gap: 3,
          "& .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            p: 3,
          },
        }}
      >
        <Paper sx={{ alignItems: "center", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "25em",
                padding: "5em",
                filter: `drop-shadow(0 0.25em 0.5em ${colors.secondary[500]})`,
              }}
            >
              <img
                alt=""
                src={logo}
                style={{
                  height: "15em",
                  width: "15em",
                  objectFit: "contain",
                  padding: "1em",
                }}
              />
            </Paper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                zIndex: 1,
              }}
            >
              <Typography variant="h3" textTransform="capitalize">
                {getUserDetails?.middleName
                  ? getUserDetails?.firstName +
                    " " +
                    getUserDetails?.middleName.charAt(0) +
                    ". " +
                    getUserDetails?.lastName
                  : getUserDetails?.firstName + " " + getUserDetails?.lastName}
              </Typography>
              <Typography variant="h3">{getUserDetails?.email}</Typography>
              <Typography variant="h3">
                {getUserDetails?.userType === "admin" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      backgroundColor: colors.secondary[500],
                      color: colors.black[100],
                      alignItems: "center",
                      boxShadow: `rgba(0, 0, 0, 0.5) 0px 1px 3px, ${colors.primary[900]} 0px 0px 0px 2px`,
                    }}
                  >
                    <AdminPanelSettings />
                    <Typography sx={{ ml: "10px" }} fontWeight={600}>
                      Admin
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      backgroundColor: colors.secondary[500],
                      color: colors.black[100],
                      alignItems: "center",
                      boxShadow: `rgba(0, 0, 0, 0.5) 0px 1px 3px, ${colors.primary[900]} 0px 0px 0px 2px`,
                    }}
                  >
                    <BadgeOutlined />
                    <Typography sx={{ ml: "10px" }}>Employee</Typography>
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Divider orientation="vertical" sx={{ height: "100%", m: 1 }} />
        <Paper
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            // backgroundColor: "blue"
          }}
        >
          <Box sx={{ position: "absolute", top: 5, right: 5 }}>
            <IconButton onClick={handleClick}>
              <MoreVert sx={{ fontSize: "20pt" }} />
              {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={toggleEditForm}>
                <Typography>Edit Profile</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h3"
            sx={{
              paddingLeft: "0.3em",
              borderLeft: `solid 5px ${colors.secondary[500]}`,
            }}
            fontWeight={700}
          >
            Basic Information
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              padding: "20px",
              // backgroundColor: "red",
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Full name
              </Typography>
              <Typography textTransform="capitalize">
                {getUserDetails?.middleName
                  ? getUserDetails?.firstName +
                    " " +
                    getUserDetails?.middleName.charAt(0) +
                    ". " +
                    getUserDetails?.lastName
                  : getUserDetails?.firstName + " " + getUserDetails?.lastName}
              </Typography>
            </Box>
            <Divider sx={{ m: "1em 0" }} />{" "}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Email address
              </Typography>
              <Typography>{getUserDetails?.email}</Typography>
            </Box>
            <Divider sx={{ m: "1em 0" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Mobile
              </Typography>
              <Typography>{"09" + getUserDetails?.mobile}</Typography>
            </Box>
            <Divider sx={{ m: "1em 0" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Address
              </Typography>
              <Typography>{getUserDetails?.address}</Typography>
            </Box>
            <Divider sx={{ m: "1em 0" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Birthday
              </Typography>
              <Typography>
                {getUserDetails?.birthday !== undefined
                  ? format(new Date(getUserDetails?.birthday), "MMMM dd, yyyy")
                  : ""}
              </Typography>
            </Box>
            <Divider sx={{ m: "1em 0" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                Password
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  "& a": {
                    textDecoration: "none",
                    color: colors.black[100],
                  },
                }}
              >
                <Edit />
                <Link to="/admin/changePassword">Change password</Link>
              </Box>
            </Box>
            <Divider sx={{ m: "1em 0" }} />
          </Box>
        </Paper>
      </Box>
    );
  };
  const SetEditForm = () => {
    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "row",
          gap: 3,
          "& .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            p: 3,
          },
        }}
      >
        <Paper sx={{ alignItems: "center", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "25em",
                padding: "5em",
                filter: `drop-shadow(0 0.25em 0.5em ${colors.secondary[500]})`,
              }}
            >
              <img
                alt=""
                src={logo}
                style={{
                  height: "15em",
                  width: "15em",
                  objectFit: "contain",
                  padding: "1em",
                }}
              />
            </Paper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                zIndex: 1,
              }}
            >
              <Typography variant="h3" textTransform="capitalize">
                {getUserDetails?.middleName
                  ? getUserDetails?.firstName +
                    " " +
                    getUserDetails?.middleName.charAt(0) +
                    ". " +
                    getUserDetails?.lastName
                  : getUserDetails?.firstName + " " + getUserDetails?.lastName}
              </Typography>
              <Typography variant="h3">{getUserDetails?.email}</Typography>
              <Typography variant="h3">
                {getUserDetails?.userType === "admin" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      backgroundColor: colors.secondary[500],
                      color: colors.black[100],
                      alignItems: "center",
                      boxShadow: `rgba(0, 0, 0, 0.5) 0px 1px 3px, ${colors.primary[900]} 0px 0px 0px 2px`,
                    }}
                  >
                    <AdminPanelSettings />
                    <Typography sx={{ ml: "10px" }} fontWeight={600}>
                      Admin
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      backgroundColor: colors.secondary[500],
                      color: colors.black[100],
                      alignItems: "center",
                      boxShadow: `rgba(0, 0, 0, 0.5) 0px 1px 3px, ${colors.primary[900]} 0px 0px 0px 2px`,
                    }}
                  >
                    <BadgeOutlined />
                    <Typography sx={{ ml: "10px" }}>Employee</Typography>
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Divider orientation="vertical" sx={{ height: "100%", m: 1 }} />
        <Paper
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            // backgroundColor: "blue"
          }}
        >
          <Typography
            variant="h3"
            sx={{
              paddingLeft: "0.3em",
              borderLeft: `solid 5px ${colors.secondary[500]}`,
            }}
            fontWeight={700}
          >
            Edit profile
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              padding: "20px",
              // backgroundColor: "red",
              mt: 2,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Full name
                </Typography>
                <Typography textTransform="capitalize">
                  {getUserDetails?.middleName
                    ? getUserDetails?.firstName +
                      " " +
                      getUserDetails?.middleName.charAt(0) +
                      ". " +
                      getUserDetails?.lastName
                    : getUserDetails?.firstName +
                      " " +
                      getUserDetails?.lastName}
                </Typography>
              </Box>
              <Divider sx={{ m: "1em 0" }} />{" "}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Email address
                </Typography>
                <TextField
                  required
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder=""
                  autoComplete="off"
                  error={emailError}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                />
              </Box>
              <Divider sx={{ m: "1em 0" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Mobile
                </Typography>

                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Mobile Number"
                  error={mobileError}
                  value={mobile}
                  placeholder="9 Digit Mobile Number"
                  inputProps={{ maxLength: 9 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isNumber(value) || "") {
                      setMobileError(false);
                      if (value.length != 9) {
                        setMobileError(true);
                        setMobile(value);
                      }
                      setMobile(value);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <>
                        <Typography>09</Typography>
                        <Divider
                          sx={{ height: 28, m: 0.5 }}
                          orientation="vertical"
                        />
                      </>
                    ),
                  }}
                />
              </Box>
              <Divider sx={{ m: "1em 0" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Address
                </Typography>
                <TextField
                  required
                  label="Address"
                  variant="outlined"
                  placeholder="House Number, Street Barangay, City, Province"
                  autoComplete="off"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </Box>
              <Divider sx={{ m: "1em 0" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Birthday
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Birthday"
                    inputFormat="MM/dd/yyyy"
                    value={birthday}
                    onChange={setBirthday}
                    renderInput={(params) => (
                      <TextField
                        autoComplete="off"
                        error={false}
                        required
                        disabled
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Divider sx={{ m: "1em 0" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h4" fontWeight={600}>
                  Password
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    "& a": {
                      textDecoration: "none",
                      color: colors.black[100],
                    },
                  }}
                >
                  <Edit />
                  <Link to="/admin/changePassword">Change password</Link>
                </Box>
              </Box>
              <Divider sx={{ m: "1em 0" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  p: 1,
                  gap: 2,
                  "& > button": {
                    height: "55px",
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
                  onClick={toggleEditForm}
                >
                  <Typography variant="h4">Cancel</Typography>
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    );
  };

  const clearFields = () => {
    setEmail("");
    setAddress("");
    setMobile("");
    setBirthday(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingDialog({ isOpen: true });
      const employee = {
        email,
        address,
        mobile,
        birthday,
      };

      const sendData = await axiosPrivate.patch(
        `/api/users/update/${auth.username}`,
        JSON.stringify(employee)
      );
      if (sendData.status === 200) {
        const json = await sendData.data;
        setSuccessDialog({
          isOpen: true,
          title: `Profile has been added!`,
        });
        setLoadingDialog({ isOpen: false });
        clearFields();
      }
    } catch (error) {
      console.log("🚀 ~ file: UserProfile.jsx:790 ~ handleSubmit ~ r", r);
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");
        setErrorDialog({
          isOpen: true,
          message: `${"No server response!"}`,
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 500) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        console.log(error);
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
      }
    }
  };
  const toggleEditForm = () => {
    setAnchorEl(null);
    setIsEditOpen((prev) => !prev);
  };
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
            Profile
          </Typography>
        </Box>

        {isEditOpen ? SetEditForm() : SetUserDetails()}
      </Paper>
    </Box>
  );
};

export default UserProfile;
