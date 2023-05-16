import React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  IconButton,
  ButtonBase,
} from "@mui/material";
import { tokens } from "../../../themes";
import {
  PersonAddAlt1,
  CheckCircle,
  Cancel,
  Delete,
  Edit,
  AdminPanelSettings,
  BadgeOutlined,
  LockResetOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { format } from "date-fns-tz";

import { useUsersContext } from "../../../hooks/useUsersContext";
import useAuth from "../../../hooks/useAuth";
import Paper_Active from "../../../global/Paper_Active";
import Paper_Icon from "../../../global/Paper_Icon";
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar
      // printOptions={{
      //   fields: ["username", "name", "email", "status"],
      // }}
      // csvOptions={{ fields: ["username", "firstName"] }}
      />
      {/* <GridToolbarExport */}

      {/* /> */}
    </GridToolbarContainer>
  );
}

const Employee = () => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { users, usersDispatch } = useUsersContext();

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
  });

  const [page, setPage] = React.useState(15);
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Typography
            sx={{ textTransform: "lowercase", fontSize: "0.8125rem" }}
          >
            {params?.value}
          </Typography>
        );
      },
    },

    {
      field: "name",
      headerName: "Name",
      width: 250,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.middleName || ""} ${
          params.row.lastName || ""
        }`,
    },
    {
      field: "address",
      headerName: "Address",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobile",
      headerName: "Mobile #",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => "09" + params.value,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Typography
            sx={{ textTransform: "lowercase", fontSize: "0.8125rem" }}
          >
            {params?.value}
          </Typography>
        );
      },
    },
    {
      field: "userType",
      headerName: "User Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return params?.value === "admin" ? (
          <Paper sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}>
            <AdminPanelSettings />
            <Typography sx={{ ml: "10px" }} fontWeight={600}>
              Admin
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}>
            <BadgeOutlined />
            <Typography sx={{ ml: "10px" }}>Employee</Typography>
          </Paper>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={auth?.username === params?.row.username}
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: `Are you sure to change status of  ${params?.row?.firstName}  ${params?.row?.lastName}`,
                  message: `${
                    params?.value === true
                      ? " ACTIVE to INACTIVE"
                      : " INACTIVE to ACTIVE"
                  }`,
                  onConfirm: () => {
                    toggleStatus({ val: params?.row });
                  },
                });
              }}
            >
              {params?.value === true ? (
                <Paper
                  sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}
                >
                  <CheckCircle
                    sx={{
                      color: "green",
                    }}
                  />
                  <Typography>Active</Typography>
                </Paper>
              ) : (
                <Paper
                  sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}
                >
                  <Cancel
                    sx={{
                      color: "red",
                    }}
                  />
                  <Typography>Inactive</Typography>
                </Paper>
              )}
            </IconButton>
          </>
        );
      },
    },

    {
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonBase
              onClick={(event) => {
                handleCellEditClick(event, params);
              }}
            >
              <Paper_Icon icon={<Edit />} color={`${colors.primary[500]}`} />
            </ButtonBase>
            {auth?.username === "2192359398" ||
            params?.row?.username === "2192359398" ? (
              <></>
            ) : (
              <ButtonBase
                disabled={"2192359398" === params?.row?.username}
                onClick={(event) => {
                  handleCellClick(event, params);
                }}
              >
                <Paper_Icon
                  icon={<Delete />}
                  color={`${colors.redDark[500]}`}
                />
              </ButtonBase>
            )}
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
  ];
  const handleCellEditClick = (event, params) => {
    event.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to edit employee `,
      message: `[${params?.row?.username}]`,
      onConfirm: () => {
        navigate(`edit/${params?.row.username}`);
      },
    });
  };
  const handleCellClick = (event, params) => {
    event.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete ${params?.row?.firstName} ${params?.row?.lastName}`,
      message: `This action is irreversible!`,
      onConfirm: () => {
        handleDelete({ val: params.row });
      },
    });
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/users/allUsers");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: Employee.jsx:65 ~ getData ~ json", json);
          usersDispatch({ type: "SET_USERS", payload: json });
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
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
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
    getData();
  }, []);
  const toggleStatus = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);
    if (val.status === true) newStatus = false;
    try {
      setLoadingDialog({ isOpen: true });
      const apiStatus = await axiosPrivate.patch(
        `/api/users/status/${val.username}`,
        JSON.stringify({ status: newStatus })
      );
      if (apiStatus.status === 200) {
        const apiEmployee = await axiosPrivate.get("/api/users/allUsers");
        if (apiEmployee?.status === 200) {
          const json = await apiEmployee.data;
          usersDispatch({ type: "SET_USERS", payload: json });
          setSuccessDialog({ isOpen: true });
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
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
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
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.delete(
        `/api/users/delete/${val.username}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(json);
        usersDispatch({ type: "DELETE_USER", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `User ${val.username} has been Deleted!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      console.log(error);
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
      }
    }
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
            Employee
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Button
              sx={{ height: "100%", color: "white" }}
              variant="contained"
              startIcon={<PersonAddAlt1 />}
              onClick={() => {
                navigate("add");
              }}
            >
              <Typography> Add Employee</Typography>
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: "100%" }}>
          <DataGrid
            rows={users ? users : []}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={page}
            onPageSizeChange={(newPageSize) => setPage(newPageSize)}
            rowsPerPageOptions={[15, 50]}
            pagination
            sx={{
              "& .MuiDataGrid-cell": {
                textTransform: "capitalize",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  createdAt: false,
                  email: false,
                  address: false,
                  mobile: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Employee;
