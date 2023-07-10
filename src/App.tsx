import { Provider } from "react-redux";
import { HashRouter, BrowserRouter } from "react-router-dom";
import store from './redux/store';
import Views from "./pages";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from "./redux/store";
import "antd/dist/reset.css";
import "./App.scss";
const App = () => {
	return (<div className="App">
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Views />
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</div>)
}

export default App;