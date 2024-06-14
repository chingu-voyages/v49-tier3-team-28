"use client";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Divider, Drawer, IconButton, Toolbar } from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { AppNameTextLogo } from "../App-name-text-logo/App-name-text-logo";
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
          <div className="flex flex-col gap-y-5 mt-2">
            <div className="flex justify-center hover:bg-orange-500 cursor-pointer mt-1 hover:text-white p-2">
              <ProfileIcon className="self-center" />
              <p className="robotoFont text-base font-bold ml-4 leading-7">
                Profile
              </p>
            </div>
            <div
              className="flex justify-center hover:bg-orange-500 cursor-pointer hover:text-white p-2  "
              onClick={() => signOut({ redirect: false, callbackUrl: "/" })}
            >
              <LogoutIcon className="self-center" />
              <p className="robotoFont text-base font-bold ml-4 leading-7">
                Log Out
              </p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
