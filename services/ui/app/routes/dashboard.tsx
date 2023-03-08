import Navigation from "~/components/Navigation";
import Sidebar from "~/components/Sidebar";
import { Outlet } from "@remix-run/react";

export default function DashboardLayout() {
  return (
    <>
      <Navigation />
      <div className="flex flex-row">
        <div className="basis-1/6">
          <Sidebar />
        </div>
        <Outlet />
      </div>
    </>
  );
}
