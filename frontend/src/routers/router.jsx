import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import TransmissionLinePage from "../pages/TransmissionLinePage";
import HomePage from "../components/HomePage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element:<TransmissionLinePage />,
        },
        {
          path: "/home",
          element:<HomePage />,
        },
      ],
    },
    
  ]);

  export default router;
