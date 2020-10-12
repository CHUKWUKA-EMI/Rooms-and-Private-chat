import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Join from "./component/Join";
import ChatBox from "./component/ChatBox";

function App() {
	return (
		<div className="App">
			<Router>
				<Route exact path="/" component={Join} />
				<Route path="/chat" component={ChatBox} />
			</Router>
		</div>
	);
}

export default App;
