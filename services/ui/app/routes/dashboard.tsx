import Navigation from "~/components/Navigation";
import Sidebar from "~/components/Sidebar";
import { Outlet } from "@remix-run/react";
import Container from "~/components/Container";

export default function DashboardLayout() {
  return (
    <>
      <Navigation />
      <div className="flex flex-row">
        <div className="basis-1/6">
          <Sidebar />
        </div>
        <div className="w-full">
          <Container>
            <Outlet />

          </Container>
        </div>
      </div>
    </>
  );
}
