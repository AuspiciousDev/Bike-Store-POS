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

import { useSalesContext } from "../../../hooks/useSalesContext";

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
const Sales = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { sales, salesDispatch } = useSalesContext();
  const [selectedSales, setSelectedSales] = useState("");

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
      headerName: "Transaction ID",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Paper
            sx={{
              width: "100%",
              padding: "2px 20px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              backgroundColor: colors.whiteOnly[500],
              alignItems: "center",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ fontSize: "8pt", color: colors.blackOnly[500] }}
            >
              {params?.value}
            </Typography>
          </Paper>
        );
      },
    },
    {
      field: "transactor",
      headerName: "Transactor",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalSum",
      headerName: "Total Sales",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <> {"₱ " + params.value}</>;
      },
    },
    {
      field: "discountAmount",
      headerName: "Discount Amount",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "vatAmount",
      headerName: "Vat Amount",
      width: 150,
    },

    {
      field: "createdAt",
      headerName: "Transaction Date",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
  ];

  const viewSalesDetails = (_id) => {
    setConfirmDialog({
      isOpen: true,
      message: `View ${_id} sale details?`,
      onConfirm: () => {
        navigate(`${_id}`);
      },
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/sales/allSales");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: Sales.jsx:144 ~ getData ~ json", json);
          salesDispatch({ type: "SET_SALES", payload: json });
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
            Sales
          </Typography>
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
            rows={sales ? sales : []}
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
                  vatAmount: false,
                  discountAmount: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = sales.filter((row) =>
                selectedIDs.has(row._id.toString())
              );
              viewSalesDetails(selectedRowData[0].transactionID);
              setSelectedSales(selectedRowData[0]._id);
              console.log(selectedRowData[0]._id);
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Sales;
