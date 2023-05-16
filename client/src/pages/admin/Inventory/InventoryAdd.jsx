import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  TextField,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { tokens } from "../../../themes";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useInventoriesContext } from "../../../hooks/useInventoriesContext";

const InventoryAdd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { inventory, inventoryDispatch } = useInventoriesContext();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [productNameError, setProductNameError] = useState(false);

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
  const clearFields = () => {
    setProductName("");
    setPrice("");
    setQuantity("");
    setBrand("");
    setCategory("");
    setNewCategory("");
    setSupplier("");
  };
  useEffect(() => {
    const getData = async () => {
      try {
        let allCategory = [];
        let filteredCategory = [];
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/inventory/allProducts");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: InventoryAdd.jsx:88 ~ getData ~ json", json);
          json &&
            json.map((val) => {
              return allCategory.push(val.category);
            });
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
        }
        filteredCategory = [...new Set(allCategory)];

        setCategoryList([...filteredCategory]);

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
    let expiredOnTemp, finalCategory;
    try {
      setLoadingDialog({ isOpen: true });

      category === "newCategory"
        ? (finalCategory = newCategory)
        : (finalCategory = category);
      const product = {
        productName,
        price,
        quantity,
        brand,
        category: finalCategory,
        supplier,
      };
      const sendData = await axiosPrivate.post(
        `/api/inventory/create`,
        JSON.stringify(product)
      );
      if (sendData.status === 201) {
        const json = await sendData.data;
        setSuccessDialog({
          isOpen: true,
          message: `Product [${json.productName}]  has been added!`,
        });
        setLoadingDialog({ isOpen: false });
        clearFields();
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: InventoryAdd.jsx:169 ~ handleSubmit ~ error:",
        error
      );
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
            Create new product
          </Typography>
        </Box>
        <Divider sx={{ m: "1em 0" }} />
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
              Product Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                required
                label="Product Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={productNameError}
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                }}
              />
              <TextField
                required
                type="number"
                label="Price"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <TextField
                required
                type="number"
                label="Quantity"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
              <TextField
                required
                label="Brand"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />
              {category === "newCategory" ? (
                <TextField
                  required
                  label="New Category"
                  variant="outlined"
                  placeholder=""
                  autoComplete="off"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                  }}
                />
              ) : (
                <FormControl required>
                  <InputLabel id="demo-simple-select-required-label">
                    Category
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    {categoryList &&
                      categoryList.map((value) => {
                        return (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        );
                      })}
                    <MenuItem value={"newCategory"}>New Category</MenuItem>
                  </Select>
                </FormControl>
              )}
              <TextField
                required
                label="Supplier"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                }}
              />
            </Box>

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
              <Button
                type="submit"
                variant="contained"
                disabled={productNameError}
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
                <Typography variant="h4">Clear</Typography>
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryAdd;
