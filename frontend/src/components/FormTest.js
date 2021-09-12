import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";

const FormTest = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);

  return (
    <Grid container spacing={4} direction="column">
      <Grid item>
        <TextField
          variant="outlined"
          color="primary"
          value={password}
          type="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ "data-testid": "account-delete-password" }}
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              data-testid="account-delete-confirm"
              onChange={() => setConfirm(!confirm)}
              color="primary"
            />
          }
          label="I understand that my account information cannot be recovered after deleted"
        />
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          data-testid="account-delete-submit"
          disabled={!password || !confirm}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormTest;
