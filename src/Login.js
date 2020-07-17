import React, { useContext, useState } from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { AuthContext } from "./authContext"

export default function LoginDialog({ open, setOpen }) {
  const { authenticated, setAuthenticated, authBody, setAuthBody } = useContext(
    AuthContext
  )
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogin = async () => {
    const response = await fetch("https://cms2.caseytimm.com/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: user,
        password: password,
      }),
    })
    const data = await response.json()
    if (response.ok) {
      setAuthBody({ data })
      setAuthenticated(true)
      setOpen(false)
      setError(false)
      setUser("")
      setPassword("")
    } else {
      setError(true)
      setPassword("")
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your Credentials</DialogContentText>
          <TextField
            error={error}
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="username"
            fullWidth
            value={user}
            onChange={(e) => setUser(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) handleLogin()
            }}
          />
          <TextField
            error={error}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) handleLogin()
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
