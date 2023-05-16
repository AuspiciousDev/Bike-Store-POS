import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog,
  Box,
  useTheme,
  IconButton,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Person,
  Add,
  Remove,
  FastRewind,
  RestartAlt,
  Cancel,
  CheckCircle,
} from "@mui/icons-material";
import { tokens } from "../themes";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useInventoriesContext } from "../hooks/useInventoriesContext";

import { darken, lighten } from "@mui/material/styles";
import { useEffect } from "react";
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
const SearchProductDialogue = (props) => {
  const { onClose, selectedValue, open } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { inventory, inventoryDispatch } = useInventoriesContext();

  const [_id, set_id] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productSum, setProductSum] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [page, setPage] = React.useState(15);
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
  ];

  const handleClose = () => {
    onClose(selectedValue);
    clearFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleListItemClick();
  };

  const handleListItemClick = () => {
    const value = {
      productID: _id,
      productName,
      price,
      quantity,
      productSum: quantity * price,
      productQuantity,
    };
    onClose(value);
    clearFields();
  };
  const clearFields = () => {
    set_id("");
    setProductName("");
    setPrice("");
    setProductSum("");
    setQuantity("");
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography
          sx={{
            fontSize: "24pt",
            paddingLeft: "0.3em",
            borderLeft: `solid 5px ${colors.secondary[500]}`,
          }}
        >
          Search Product
        </Typography>
      </DialogTitle>
      <Divider
        sx={{ m: "0 1.5em", backgroundColor: `${colors.primary[900]}` }}
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Paper
            elevation={5}
            sx={{
              display: "flex",
              width: "100%",
              height: "4em",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              gap: 1,
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                width: "100%",
              }}
              fontWeight={700}
            >
              {productName || "Select a product"}
            </Typography>
            <Divider orientation="vertical" />
            <TextField
              required
              disabled={!_id || quantity === 0}
              autoComplete="off"
              sx={{ width: "100%" }}
              variant="outlined"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(
                  0,
                  Math.min(productQuantity, Number(e.target.value))
                );
                setQuantity(parseInt(value, 10));
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="subtitle2"
                      sx={{ color: colors.black[400] }}
                    >
                      {productQuantity}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: "50px",
              m: "1em 0",
            }}
          >
            <Button
              fullWidth
              type="submit"
              disabled={!_id || !quantity}
              variant="contained"
              color="primary"
              sx={{ height: "100%", color: colors.black[900] }}
              startIcon={<Add />}
            >
              <Typography variant="h5"> Add </Typography>
            </Button>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              sx={{ height: "100%", color: colors.black[900] }}
              startIcon={<RestartAlt />}
              onClick={clearFields}
            >
              <Typography variant="h5"> Reset</Typography>
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            display: "flex",
            height: "50vmin",
            width: "100%",
            m: "1em 0",
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

              set_id(selectedRowData[0]._id);
              setProductName(selectedRowData[0].productName);
              setPrice(selectedRowData[0].price);

              setProductQuantity(selectedRowData[0].quantity);
            }}
            getRowClassName={(params) =>
              `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
            }
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default SearchProductDialogue;

// <List sx={{ pt: 0 }}>
//         {emails.map((email) => (
//           <ListItem
//             button
//             onClick={() => handleListItemClick(email)}
//             key={email}
//           >
//             <ListItemAvatar>
//               <Avatar>
//                 <Person />
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText primary={email} />
//           </ListItem>
//         ))}

//         <ListItem
//           autoFocus
//           button
//           onClick={() => handleListItemClick("addAccount")}
//         >
//           <ListItemAvatar>
//             <Avatar>
//               <Add />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText primary="Add account" />
//         </ListItem>
//       </List>
