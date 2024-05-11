
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import './App.css';
import NavigationBar from './Navbar/NavigationBar';
import Search from './Search/Search';
import Cities from './Components/Cities';
import Login from './Components/Login';
import Register from "./Components/Register.js";
import { AuthProvider } from "./Services/Contexts/authContext/index.js";
import SavedProperties from "./Components/SavedProperties.js";
import Alert from "./Components/AlertMessage.js";


function App() {

  const routesArray = [
    {
      path: "/",
      element: <Search />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/cities",
      element: <Cities />,
    },

    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "/savedProperties",
      element: <SavedProperties />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (

    <AuthProvider>
      
      <NavigationBar />

      <div className="w-full flex flex-col z-20">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
