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
  Inventory2Outlined,
  PendingActionsOutlined,
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
import { useRestocksContext } from "../../../hooks/useRestocksContext";

import { darken, lighten } from "@mui/material/styles";
import Paper_Icon from "../../../global/Paper_Icon";

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
const Restock = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { inventory, inventoryDispatch } = useInventoriesContext();
  const { restocks, restockDispatch } = useRestocksContext();

  const getCurrentDate = new Date();
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
      headerName: "Restock ID",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productID",
      headerName: "Product ID",
      width: 250,
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
      field: "restockBy",
      headerName: "Restock By",
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
      field: "deliveryDate",
      headerName: "Delivery Date",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "createdAt",
      headerName: "Restock Date",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
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
            {params?.value === true ? (
              <Paper_Icon icon={<CheckCircle />} color={`green`} />
            ) : (
              <Paper_Icon
                icon={<PendingActionsOutlined />}
                color={`${colors.secondary[500]}`}
              />
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/restock/allRestocks");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: Restock.jsx:160 ~ getData ~ json", json);
          restockDispatch({ type: "SET_RESTOCKS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Restock.jsx:225 ~ getData ~ error", error);
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
            Restocks
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
              startIcon={<Inventory2Outlined />}
              onClick={() => {
                navigate("add");
              }}
            >
              <Typography> Restock Product</Typography>
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
          {/* .filter((filter) => {
                    return (
                      format(new Date(filter.deliveryDate), "MM dd yyyy") >=
                      format(new Date(), "MM dd yyyy")
                    );
                  }) */}
          <DataGrid
            rows={restocks ? restocks : []}
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
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Restock;
