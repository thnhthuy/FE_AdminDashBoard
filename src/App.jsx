import { BrowserRouter, Routes, Route } from "react-router-dom";
import routers from "@routers/routers";
import { Suspense } from "react";
import { ToastProvider } from "./contexts/ToastContext";
import { SideBarProvider } from "@contexts/SideBarContext";
import AdminDashBoard from "@layout/adminDashBoard/AdminDashBoard";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SideBarProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AdminDashBoard>
              <Routes>
                {routers.map((item) => (
                  <Route
                    path={item.path}
                    element={<item.Component />}
                    key={item.path}
                  />
                ))}
              </Routes>
            </AdminDashBoard>
          </Suspense>
        </SideBarProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
