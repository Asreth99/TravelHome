
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './Navbar/NavigationBar';
import Search from './Search/Search';
import Cities from './Components/Cities';


function App() {
    return (
    <Router>
      <div className="App">
        <NavigationBar />

       <Routes>
        <Route path='/' element = {<Search />} />
        <Route path='/cities' element = {<Cities />} />
       </Routes>

      </div>
    </Router>
  );
}

export default App;
