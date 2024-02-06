import logo from './logo.svg';
import './App.css';
import Navigation from './Navigation';
import Packages from './screens/Packages';
import Registration from './screens/Registration';
import { UserState } from './Context/userContext/state';

function App() {
  return (
    <div className="App">
      <UserState>
    <Navigation/>
    </UserState>

    </div>
  );
}

export default App;
