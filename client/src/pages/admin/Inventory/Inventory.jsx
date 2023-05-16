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
  Fastfood,
  FastfoodOutlined,
  Edit,
  TwoWheelerOutlined,
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

import { useInventoriesContext } from "../../../hooks/useInventoriesContext";

import { darken, lighten } from "@mui/material/styles";

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

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
const Inventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { inventory, inventoryDispatch } = useInventoriesContext();

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
      field: "_id",
      headerName: "Product ID",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "price",
      headerName: "Price",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "necessity",
      headerName: "Necessity",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value === true ? (
              <Paper sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}>
                <CheckCircle
                  sx={{
                    color: "green",
                  }}
                />
                <Typography>Discount</Typography>
              </Paper>
            ) : (
              <Paper sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}>
                <Cancel
                  sx={{
                    color: "red",
                  }}
                />
                <Typography> None</Typography>
              </Paper>
            )}
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ButtonBase
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: `Are you sure to change status of  ${params?.row?.productName}`,
                  message: `${
                    params?.value === true
                      ? "ACTIVE to ARCHIVED"
                      : "INACTIVE to ACTIVE"
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
                <Cancel
                  sx={{
                    color: "red",
                  }}
                />
              )}
            </ButtonBase>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 175,
      sortable: false,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={(event) => {
                handleCellEditClick(event, params);
              }}
            >
              <Edit sx={{ color: colors.black[100] }} />
            </IconButton>
            <IconButton
              onClick={(event) => {
                handleCellDeleteClick(event, params);
              }}
            >
              <Delete sx={{ color: "red" }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleCellEditClick = (event, params) => {
    event.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to edit [${params?.row?.productName}] ${params?.row?._id}`,
      onConfirm: () => {
        navigate(`edit/${params?.row?._id}`);
      },
    });
  };
  const handleCellDeleteClick = (event, params) => {
    event.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete [${params?.row?.productName}]`,
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
        const response = await axiosPrivate.get("/api/inventory/allProducts");
        if (response.status === 200) {
          const json = await response.data;
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
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
        `/api/inventory/status/${val._id}`,
        JSON.stringify({ status: newStatus })
      );
      if (apiStatus.status === 200) {
        const apiEmployee = await axiosPrivate.get(
          "/api/inventory/allProducts"
        );
        if (apiEmployee?.status === 200) {
          const json = await apiEmployee.data;
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });

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
        `/api/inventory/delete/${val._id}`
      );
      const json = await response.data;
      if (response.status === 200) {
        inventoryDispatch({ type: "DELETE_INVENTORY", payload: json });
        console.log(json);
        setSuccessDialog({
          isOpen: true,
          message: `${val.productName} has been Deleted!`,
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
            Inventory
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
              startIcon={<TwoWheelerOutlined />}
              onClick={() => {
                navigate("add");
              }}
            >
              <Typography> Add Product</Typography>
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            "& .super-app-theme--Low": {
              bgcolor: "#F68181",
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode
                  ),
              },
            },
          }}
        >
          <DataGrid
            rows={
              inventory
                ? inventory.filter((filter) => {
                    return filter.status === true;
                  })
                : []
            }
            getRowId={(row) => row?._id}
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
                  _id: false,
                  createdAt: false,
                  address: false,
                  action: false,
                  necessity: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            getRowClassName={(params) =>
              `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Inventory;
