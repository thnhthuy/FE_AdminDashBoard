import { SideBarProvider } from "@contexts/SideBarContext";
import AdminDashBoard from "@layout/adminDashBoard/AdminDashBoard";

function App() {
  return (
    <>
      <SideBarProvider>
        <AdminDashBoard />
      </SideBarProvider>
    </>
  );
}

export default App;
