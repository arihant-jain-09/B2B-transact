import './App.scss';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Header from './Header/Header';
import Companies from '../pages/Companies/Companies';
const App=()=> {
  return (
    <div className='app'>
      <BrowserRouter>
        <Header/>
         <Switch>
            <Route to='/companies'>
              <Companies/>
            </Route>
         </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
