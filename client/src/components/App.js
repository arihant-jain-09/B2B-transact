import './App.scss';
import {BrowserRouter} from 'react-router-dom';
import Header from './Header/Header';
// import Companies from '../pages/Companies/Companies';
// import Products from '../pages/Products/products';
// import Invoices from '../pages/Invoices/invoices';
// import Users from '../pages/Users/users.jsx';
// import Employee from '../pages/Employee/employee.jsx';
const App=()=> {
  return (
    <div className='app'>
      <BrowserRouter>
        <Header/>
      </BrowserRouter>
    </div>
  );
}

export default App;
