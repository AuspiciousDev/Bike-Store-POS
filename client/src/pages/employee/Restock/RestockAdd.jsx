import React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  IconButton,
  ButtonBase,
  TextField,
  Checkbox,
  Divider,
} from "@mui/material";
import { tokens } from "../../../themes";
import { CheckCircle, Cancel, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { format } from "date-fns-tz";
import moment from "moment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useRestocksContext } from "../../../hooks/useRestocksContext";
import { useInventoriesContext } from "../../../hooks/useInventoriesContext";
import useAuth from "../../../hooks/useAuth";

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
import { darken, lighten } from "@mui/material/styles";

const getBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const RestockAdd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const { restocks, restockDispatch } = useRestocksContext();
  const { inventory, inventoryDispatch } = useInventoriesContext();

  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isFood, setIsFood] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [deliveryDateError, setDeliveryDateError] = useState(true);
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
  const [page, setPage] = React.useState(10);
  const columns = [
    {
      field: "_id",
      headerName: "Product ID",
      width: 180,
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 150,
    },

    {
      field: "price",
      headerName: "Price",
      width: 150,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 150,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 150,
    },

    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
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
              <Paper sx={{ display: "flex", padding: "0.25em 0.5em", gap: 1 }}>
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
          </>
        );
      },
    },
  ];
  const clearFields = () => {
    setProductID("");
    setProductName("");
    setQuantity("");
    setSupplier("");
    setDeliveryDate(null);
  };
  useEffect(() => {
    selectedProduct && setProductName(selectedProduct.productName);
    selectedProduct && setProductID(selectedProduct._id);
    selectedProduct && setSupplier(selectedProduct.supplier);
  }, [selectedProduct]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to restock`,
      message: ` ${productName} with quantity of ${quantity}`,
      onConfirm: () => {
        handleApi();
      },
    });
    const handleApi = async () => {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });
      try {
        let expiredOnTemp;
        setLoadingDialog({ isOpen: true });
        isFood ? (expiredOnTemp = "n/a") : (expiredOnTemp = expiredOn);

        const restock = {
          restockBy: auth.username,
          productID,
          quantity,
          deliveryDate,
          supplier,
          expiredOn: expiredOnTemp,
        };
        console.log(
          "🚀 ~ file: Restock.jsx:261 ~ handleApi ~ restock",
          restock
        );

        const sendData = await axiosPrivate.post(
          `/api/restock/create`,
          JSON.stringify(restock)
        );
        if (sendData.status === 201) {
          const response = await axiosPrivate.get("/api/inventory/allProducts");
          if (response.status === 200) {
            const json = await response.data;
            console.log(
              "🚀 ~ file: RestockAdd.jsx:280 ~ handleApi ~ json",
              json
            );
            inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
            clearFields();
            setSuccessDialog({ isOpen: true, message: "Restock success!" });
          }
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Restock.jsx:273 ~ handleApi ~ error", error);
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
  };
  const handleDeliveryDate = (value) => {
    setDeliveryDateError(false);
    if (moment(value).isValid()) {
      console.log(
        "🚀 ~ file: Restock.jsx:283 ~ handleDeliveryDate ~ value",
        value
      );
      setDeliveryDate(value);
    } else {
      setDeliveryDateError(true);
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
            Restock Product
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: "1em " }} />
        <Typography
          variant="h3"
          sx={{
            paddingLeft: "0.3em",
            borderLeft: `solid 5px ${colors.secondary[500]}`,
            m: "0 0 10px 0",
          }}
        >
          Active Products
        </Typography>
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
                    return filter?.status === true;
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
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = inventory.filter((row) =>
                selectedIDs.has(row._id.toString())
              );
              setSelectedProduct(selectedRowData[0]);
              console.log(selectedRowData[0]);
            }}
            getRowClassName={(params) =>
              `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
            }
          />
        </Box>

        <Box sx={{ height: "100%" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Typography
              variant="h3"
              sx={{
                paddingLeft: "0.3em",
                borderLeft: `solid 5px ${colors.secondary[500]}`,
                m: "10px 0 10px 0",
              }}
            >
              Restock Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 3,
              }}
            >
              <TextField
                required
                disabled
                label="Product ID"
                variant="outlined"
                autoComplete="off"
                error={""}
                value={productID}
                onChange={(e) => {
                  setProductID(e.target.value);
                }}
              />
              <TextField
                required
                disabled
                label="Product Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={""}
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                }}
              />
              <TextField
                required
                label="Supplier"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={""}
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                }}
              />{" "}
              <TextField
                required
                label="Quantity"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={""}
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Delivery Date"
                  inputFormat="MM/dd/yyyy"
                  value={deliveryDate}
                  onChange={handleDeliveryDate}
                  error={deliveryDateError}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: 2,
                mt: 5,
                "& > button": {
                  width: "20em",
                  height: "4em",
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!productID || !productName || deliveryDateError}
              >
                <Typography variant="h4">Submit</Typography>
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  clearFields();
                }}
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

export default RestockAdd;
