import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { MainApp } from './pages/MainApp'

function App() {
  return (
    <main className="App">
      <Router>
          <Route path="/" component={MainApp} />
      </Router>
    </main>
  );
}

export default App;
