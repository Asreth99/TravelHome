
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './Navbar/NavigationBar';
import Search from './Search/Search';


function App() {
    return (
    <Router>
      <div className="App">
        <NavigationBar />
       <Routes>
        <Route path='/' element = {<Search />} />
       </Routes>

      </div>
    </Router>
  );
}

export default App;
