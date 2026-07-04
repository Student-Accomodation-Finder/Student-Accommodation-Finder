import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import FindHousing from './Pages/FindHousing/FindHousing';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/findhousing" exact={true} element={<FindHousing />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
