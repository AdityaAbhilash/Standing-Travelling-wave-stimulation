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
          element: <HomePage />,
        },
        {
          path: "/transmission-line",
          element: <TransmissionLinePage />,
        },
      ],
    },
    
  ]);

  export default router;
