import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import UsersPage from "./UsersPage";
import Subscription from "./Subscription";
import CustomerPortal from "./CustomerPotal";
import RecycleBin from "./RecycleBin";
import GuestPage from "./components/guestPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },

   {
    path: "/guest",
    element: < GuestPage/>,
  },


  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/bin/:dirId?",
    element: <RecycleBin />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
   {
    path: "/subscription",
    element: <Subscription/>,
  },
  {
    path:"/customer-portal",
    element:<CustomerPortal/>,
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
