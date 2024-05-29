"use client";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Divider, Drawer, IconButton, Toolbar } from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { AppNameTextLogo } from "../App-name-text-logo/App-name-text-logo";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
export function AppMenuBar() {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = (newOpen: boolean) => setOpen(newOpen);
  return (
    <div className="grow">
      <AppBar position="static" className="defaultButtonColor">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            className="!mr-2"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div
          className="w-60"
          role="presentation"
          onClick={() => toggleDrawer(false)}
        >
          <div className="flex justify-center mt-4 p-4">
            <AppNameTextLogo customClasses="text-2xl" />
          </div>
          <Divider sx={{ background: "#143452", mt: 2 }} />
          <div className="flex flex-col justify-center p-6 gap-y-5">
            <BasicRoundedButton
              label="Profile"
              buttonClassNames="!w-52 !h-7 !bg-inherit !text-black"
              startIcon={<ProfileIcon />}
              customMaterialButtonStyles={{
                "&.MuiButton-root:hover": {
                  backgroundColor: "#97A3AB !important",
                  color: "white !important",
                },
              }}
            />
            <BasicRoundedButton
              label="Log Out"
              buttonClassNames="!w-52 !h-7 !bg-inherit !text-black"
              startIcon={<LogoutIcon />}
              onClick={() => signOut({ redirect: false, callbackUrl: "/" })}
              customMaterialButtonStyles={{
                "&.MuiButton-root:hover": {
                  backgroundColor: "#97A3AB !important",
                  color: "white !important",
                },
              }}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
