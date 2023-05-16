import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  useTheme,
  InputBase,
  Divider,
  IconButton,
  Typography,
  Button,
  ButtonBase,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  TablePagination,
} from "@mui/material";
import {
  Add,
  AddOutlined,
  Cancel,
  CancelOutlined,
  Clear,
  Delete,
  Search,
  TimerOutlined,
  CheckCircle,
} from "@mui/icons-material";
import React from "react";
import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import SearchProductDialogue from "../../../global/SearchProductDialogue";
import CheckOutDialogue from "../../../global/CheckOutDialogue";
import { useEffect, useState } from "react";
import { format } from "date-fns-tz";

import { useInventoriesContext } from "../../../hooks/useInventoriesContext";
import { tokens } from "../../../themes";
import useAuth from "../../../hooks/useAuth";
import VoidProduct from "../../../global/VoidProduct";

const Cashier = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const { inventory, inventoryDispatch } = useInventoriesContext();
  const [clock, setClock] = useState(new Date());
  const { auth } = useAuth();
  let [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0.2);
  const [vat, setVat] = useState(1.12);

  const [subTotal, setSubTotal] = useState(0);
  const [discountableAmount, setDiscountableAmount] = useState(0);
  const [nonDiscountableAmount, setNonDiscountableAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);

  const [totalSale, setTotalSale] = useState(0);
  const [tenderAmount, setTenderAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(false);

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

  useEffect(() => {
    setInterval(() => setClock(new Date()), 1000);
  }, [setInterval]);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/inventory/allProducts");
        if (response.status === 200) {
          const json = await response.data;
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
          const response2 = await axiosPrivate.get("/api/restock/allRestocks");
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

  useEffect(() => {
    setSubTotal(
      items &&
        items.reduce((prev, curr) => {
          return prev + curr?.productSum;
        }, 0)
    );
  });

  useEffect(() => {
    isDiscounted
      ? setDiscountableAmount(
          items &&
            items
              .filter((filter) => {
                return filter.necessity === true;
              })
              .reduce((prev, curr) => {
                return prev + curr?.productSum;
              }, 0)
        )
      : setDiscountableAmount(0);
    isDiscounted
      ? setNonDiscountableAmount(
          items &&
            items
              .filter((filter) => {
                return filter.necessity === false;
              })
              .reduce((prev, curr) => {
                return prev + curr?.productSum;
              }, 0)
        )
      : setNonDiscountableAmount(0);
  }, [isDiscounted, items]);
  // * Get Discount Amount

  useEffect(() => {
    isDiscounted
      ? setDiscountedAmount(discountableAmount * discount)
      : setDiscountedAmount(0);
    !isDiscounted
      ? setVatAmount(subTotal * vat - subTotal)
      : setVatAmount(nonDiscountableAmount * vat - nonDiscountableAmount);
  }, [isDiscounted, subTotal, discountableAmount]);
  // * Get Total Same Amount
  useEffect(() => {
    isDiscounted
      ? setTotalSale(subTotal - discountedAmount + vatAmount)
      : setTotalSale(subTotal + vatAmount);
  });
  // * Get Changes from Tender Amount - Total Amount of sales
  useEffect(() => {
    totalSale && tenderAmount && setChangeAmount(tenderAmount - totalSale);
  }, [totalSale, tenderAmount]);

  const [open, setOpen] = React.useState(false);
  const [openCheckout, setOpenCheckOut] = React.useState(false);
  const [voidOpen, setVoidOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenCheckOut = () => {
    setOpenCheckOut(true);
  };
  const handleClickOpenVoid = () => {
    setOpenCheckOut(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setItems;
    let existingItem = items?.find((item) => {
      return item?.productID === value?.productID;
    });

    if (existingItem) {
      let totalQuantity = existingItem.quantity + value.quantity;
      existingItem.quantity =
        value.productQuantity > totalQuantity
          ? totalQuantity
          : value.productQuantity;

      existingItem.productSum =
        value.productQuantity > totalQuantity
          ? existingItem.productSum + value.productSum
          : existingItem.quantity * existingItem.price;
    } else {
      value && setItems((arr) => [...arr, value]);
    }
  };
  const handleCloseCheckOut = (value) => {
    setOpenCheckOut(false);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    value && setTenderAmount(value);
    value && handleSaveTransaction(value);
  };

  const handleCloseVoid = (value) => {
    setVoidOpen(false);
  };
  const clearFields = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setItems([]);
    setDiscountedAmount(0);
    setVatAmount(0);
    setVatAmount(0);
    setTotalSale(0);
    setTenderAmount(0);
    setChangeAmount(0);
    setIsDiscounted(false);
  };

  const toggleIsDiscounted = () => {
    setIsDiscounted((prev) => !prev);
  };
  const handleRowClick = async (value) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${value.productName}?`,
      onConfirm: () => {
        handleRemoveRow(value.productID);
      },
    });
  };
  const handleRemoveRow = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = items.filter((val) => val.productID != value);
    setItems(newItems);
  };
  const handleSaveTransaction = async (value) => {
    try {
      setLoadingDialog({ isOpen: true });
      const sales = {
        transactor: auth.username,
        items,
        totalSum: totalSale,
        discountAmount: discountedAmount,
        vatAmount: vatAmount,
      };
      const sendData = await axiosPrivate.post(
        `/api/sales/create`,
        JSON.stringify(sales)
      );
      if (sendData.status === 201) {
        const response = await axiosPrivate.get("/api/inventory/allProducts");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: RestockAdd.jsx:280 ~ handleApi ~ json", json);
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
          setSuccessDialog({ isOpen: true, message: "Transaction complete!" });
          clearFields();
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="contents">
      <SearchProductDialogue open={open} onClose={handleClose} />
      <VoidProduct open={voidOpen} onClose={handleCloseVoid} />
      <CheckOutDialogue
        open={openCheckout}
        onClose={handleCloseCheckOut}
        subTotal={totalSale}
      />
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
          flexDirection: "row",
          height: "100%",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
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
              cashier
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  p: "5px 15px",
                  mt: "0.25em",
                  height: "4em",
                  backgroundColor: colors.secondary[500],
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">
                  Product Items ({items.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <ButtonBase onClick={handleClickOpen}>
                    <Paper
                      elevation={3}
                      sx={{
                        display: "flex",
                        width: "250px",
                        alignItems: "center",
                        justifyContent: "center",
                        p: "0 10px",
                      }}
                    >
                      <Search />
                      <Divider
                        sx={{ height: 30, m: 1 }}
                        orientation="vertical"
                      />
                      <Typography sx={{ flex: 1, m: 1 }}>
                        Search Product
                      </Typography>
                    </Paper>
                  </ButtonBase>
                  <IconButton
                    type="button"
                    sx={{
                      backgroundColor: colors.black[900],
                      width: "45px",
                      height: "100%",
                    }}
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        message: `Are you sure to clear fields?`,
                        onConfirm: () => {
                          clearFields();
                        },
                      });
                    }}
                  >
                    <Delete sx={{ color: colors.black[100] }} />
                  </IconButton>
                </Box>
              </Paper>
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  flexDirection: "column",
                }}
              >
                <TableContainer component={Paper} sx={{ height: "100%" }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow
                        sx={{
                          "& > th": {
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <TableCell>Product ID</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="center">Necessity</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items &&
                        items
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((val, key) => {
                            return (
                              <TableRow
                                key={key}
                                onClick={() => handleRowClick(val)}
                              >
                                <TableCell>{val?.productID}</TableCell>
                                <TableCell>{val?.productName}</TableCell>
                                <TableCell align="center">
                                  {val?.necessity === true ? (
                                    <Paper
                                      sx={{
                                        display: "flex",
                                        padding: "0.25em 0.5em",
                                        gap: 1,
                                        justifyContent: "center",
                                      }}
                                    >
                                      <CheckCircle
                                        sx={{
                                          color: "green",
                                        }}
                                      />
                                      <Typography>Discount</Typography>
                                    </Paper>
                                  ) : (
                                    <Paper
                                      sx={{
                                        display: "flex",
                                        padding: "0.25em 0.5em",
                                        gap: 1,
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Cancel
                                        sx={{
                                          color: "red",
                                        }}
                                      />
                                      <Typography> None</Typography>
                                    </Paper>
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {val?.quantity}
                                </TableCell>
                                <TableCell align="right">
                                  {(val?.price).toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  {(val?.productSum).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider />
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  sx={{ overflow: "hidden" }}
                  count={items && items.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </Box>
            <Paper
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "60%",
                height: "100%",
                p: 2.5,
                color: colors.black[900],
                backgroundColor: colors.primary[300],
              }}
            >
              <Box
                sx={{
                  p: "0.5em 0",
                  display: "flex",
                  justifyContent: "space-evenly",

                  "&.MuiBox-root > div": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <Box>
                  <ButtonBase
                    onClick={() => {
                      window.location.reload(false);
                    }}
                  >
                    <AddOutlined sx={{ fontSize: "30px" }} />
                    <Typography variant="h5">New</Typography>
                  </ButtonBase>
                </Box>
                {/* <Box>
              <ButtonBase>
                <Clear sx={{ fontSize: "30px" }} />
                <Typography variant="h5">Cancel</Typography>
              </ButtonBase>
            </Box> */}
              </Box>
              <Divider
                sx={{ m: 1, backgroundColor: " rgba(255,255,255,0.8) " }}
              />

              <Box
                sx={{
                  p: "1em 0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: colors.black[900],
                  "&.MuiBox-root > div": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                <TimerOutlined />
                <Typography variant="h5" sx={{ paddingLeft: "10px" }}>
                  {clock.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
                <Divider
                  sx={{
                    height: 15,
                    m: 1,
                    backgroundColor: " rgba(255,255,255,0.8) ",
                  }}
                  orientation="vertical"
                />
                <Typography
                  variant="h5"
                  sx={{ width: "100px" }}
                  textAlign="center"
                >
                  {clock.toLocaleString("en-US", {
                    second: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </Typography>
                <Divider
                  sx={{
                    height: 15,
                    m: 1,
                    backgroundColor: " rgba(255,255,255,0.8) ",
                  }}
                  orientation="vertical"
                />
                <Typography variant="h5">Bisikleta Online Shop</Typography>
              </Box>
              <Divider
                sx={{ m: 1, backgroundColor: " rgba(255,255,255,0.8) " }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  m: "2em 0.5em",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h4"
                  textTransform="uppercase"
                  fontWeight={700}
                >
                  Subtotal
                </Typography>
                <Typography variant="h4" textAlign="right" fontWeight={700}>
                  {subTotal.toFixed(2)}
                </Typography>
                <Typography variant="h5">Discountable Amount</Typography>
                <Typography variant="h5" textAlign="right">
                  {(discountedAmount || 0).toFixed(2)}
                </Typography>
                <Typography variant="h5">VAT</Typography>
                <Typography variant="h5" textAlign="right">
                  {(vatAmount || 0).toFixed(2)}
                </Typography>
              </Box>
              <Divider
                sx={{ m: 1, backgroundColor: " rgba(255,255,255,0.8) " }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  m: "2em 0.5em",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h4"
                  textTransform="uppercase"
                  fontWeight={700}
                >
                  Total
                </Typography>
                <Typography variant="h4" textAlign="right" fontWeight={700}>
                  {totalSale?.toFixed(2)}
                </Typography>
                <Typography variant="h5">Tender Amount</Typography>
                <Typography variant="h5" textAlign="right">
                  {tenderAmount?.toFixed(2)}
                </Typography>
                <Typography variant="h5">Change Amount</Typography>
                <Typography variant="h5" textAlign="right">
                  {changeAmount?.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Checkbox
                    checked={isDiscounted}
                    onChange={toggleIsDiscounted}
                    sx={{ height: "5px", width: "5px", mr: 1 }}
                    color="secondary"
                  />

                  <Typography variant="h5">PWD or Senior Discount</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  disabled={totalSale === 0}
                  sx={{ height: "60px" }}
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      message: `Proceed Checkout?`,
                      onConfirm: () => {
                        handleClickOpenCheckOut();
                      },
                    });
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ color: colors.black[100] }}
                  >
                    checkout
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  sx={{ height: "60px" }}
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      message: `Are you sure to clear fields?`,
                      onConfirm: () => {
                        clearFields();
                      },
                    });
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ color: colors.black[100] }}
                  >
                    Cancel
                  </Typography>
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Cashier;
