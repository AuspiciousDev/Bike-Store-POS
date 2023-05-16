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
} from "@mui/material";
import {
  Person,
  Add,
  Remove,
  FastRewind,
  RestartAlt,
} from "@mui/icons-material";
import { tokens } from "../themes";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useInventoriesContext } from "../hooks/useInventoriesContext";

const VoidProduct = (props) => {
  const { onClose, open } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tenderAmount, setTenderAmount] = useState("");
  const [tenderAmountError, setTenderAmountError] = useState(false);

  const handleClose = () => {
    onClose();
    clearFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    tenderAmount >= subTotal
      ? handleListItemClick()
      : setTenderAmountError(true);
  };

  const handleListItemClick = () => {
    const value = tenderAmount;
    onClose(value);
    clearFields();
  };
  const clearFields = () => {
    setTenderAmount("");
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
          Checkout
        </Typography>
      </DialogTitle>
      <Divider
        sx={{ m: "0 1.5em", backgroundColor: `${colors.primary[900]}` }}
      />

      <DialogContent>
        <Typography
          sx={{
            fontSize: "16pt",
            paddingLeft: "0.3em",
            marginBottom: "0.5em ",
            borderLeft: `solid 5px ${colors.primary[500]}`,
            "& > span": {
              fontWeight: 600,
              fontSize: "18pt",
            },
          }}
        ></Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            error={tenderAmountError}
            label="Tender Amount"
            value={tenderAmount}
            autoComplete="off"
            onChange={(e) => {
              setTenderAmountError(false);
              setTenderAmount(parseInt(e.target.value, 10));
            }}
          />
          <Typography color="error" variant="subtitle2">
            {tenderAmountError && "Insufficient payment "}
          </Typography>
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
              disabled={!tenderAmount}
              variant="contained"
              color="primary"
              sx={{ height: "100%", color: colors.black[900] }}
            >
              <Typography variant="h5"> Submit </Typography>
            </Button>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              sx={{ height: "100%", color: colors.black[900] }}
              onClick={handleClose}
            >
              <Typography variant="h5"> Cancel</Typography>
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default VoidProduct;
