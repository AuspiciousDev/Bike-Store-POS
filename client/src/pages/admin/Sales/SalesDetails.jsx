import React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  IconButton,
  ButtonBase,
  Divider,
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
  ArrowRight,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
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
const SalesDetails = () => {
  const { _id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const [saleDetails, setSalesDetails] = useState([]);
  const [itemsDetails, setItemsDetails] = useState([]);

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
      headerName: "_id",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productID",
      headerName: "Product ID",
      width: 150,
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
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
  ];
  const SetSalesDetails = (val) => {
    return (
      <>
        <Typography
          variant="h4"
          textTransform="uppercase"
          sx={{
            paddingLeft: "0.3em",
            borderLeft: `solid 5px ${colors.secondary[500]}`,
            m: "1em 0",
          }}
          fontWeight="700"
        >
          Transaction Information
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            "& > .MuiPaper-root": {
              p: 1,
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            },
            "> .MuiPaper-root:hover": {
              transition: "0.3s",
              transform: "scale(1.01)",
              filter: `drop-shadow(0 0.5em 1em ${colors.secondary[500]})`,
            },
            "& .headers": {
              paddingLeft: "0.3em",
              m: "10px 0 25px 0",
              fontSize: "18pt",
              fontWeight: 600,
            },
            "& .details": {
              m: "10px 0 10px 0",
              fontSize: "14pt",
            },
            "& .details .MuiBox-root": {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            },
          }}
        >
          <Paper sx={{ borderLeft: `solid 25px ${colors.primary[500]}` }}>
            <Typography className="headers">Transaction ID: </Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />
                {val.transactionID}
              </Box>
            </Typography>
          </Paper>
          <Paper sx={{ borderLeft: `solid 25px ${colors.secondary[500]}` }}>
            <Typography className="headers">Transactor ID: </Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />
                {val.transactor}
              </Box>
            </Typography>
          </Paper>
          <Paper sx={{ borderLeft: `solid 25px ${colors.primary[500]}` }}>
            <Typography className="headers">Vat Amount</Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />₱ {val.vatAmount.toFixed(2)}
              </Box>
            </Typography>
          </Paper>
          <Paper sx={{ borderLeft: `solid 25px ${colors.secondary[500]}` }}>
            <Typography className="headers">Transaction Date</Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />
                {format(new Date(val.createdAt), "MMMM dd, yyyy")}
              </Box>
            </Typography>
          </Paper>

          {/* 
          <Paper sx={{ borderLeft: `solid 25px ${colors.secondary[500]}` }}>
            <Typography className="headers">Discount Amount</Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />
                {val.discountAmount.toFixed(2)}
              </Box>
            </Typography>
          </Paper> */}
          <Paper sx={{ borderLeft: `solid 25px ${colors.primary[500]}` }}>
            <Typography className="headers">Total Sum</Typography>
            <Typography className="details">
              <Box>
                <ArrowRight />₱ {val.totalSum.toFixed(2)}
              </Box>
            </Typography>
          </Paper>
          <span></span>
        </Box>
      </>
    );
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/sales/${_id}`);
        if (response.status === 200) {
          const json = await response.data;
          setSalesDetails(json);
          setItemsDetails([...json[0].items]);
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
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "100%",
            gap: 2,
          }}
        >
          <Box sx={{ height: "100%", width: "100%" }}>
            {saleDetails &&
              saleDetails.map((val) => {
                return SetSalesDetails(val);
              })}
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
            <Typography
              variant="h4"
              textTransform="uppercase"
              sx={{
                paddingLeft: "0.3em",
                borderLeft: `solid 5px ${colors.secondary[500]}`,
                m: "1em 0",
              }}
              fontWeight="700"
            >
              Products sold
            </Typography>
            <DataGrid
              rows={itemsDetails ? itemsDetails : []}
              getRowId={(row) => row?.productID}
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
                    _id: false,
                  },
                },
              }}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesDetails;
