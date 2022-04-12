import './App.scss';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
const App=()=> {
  return (
    <div className='app'>
      <BrowserRouter>
         <Switch>
            <Route to='/'>
              <h1>React app</h1>
            </Route>
         </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
