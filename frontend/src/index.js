import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';  // Import Redux Provider
import { AuthProvider } from './context/AuthContext';  // Import your custom AuthProvider
import store from './redux/store';  // Import the Redux store
import App from './App';

// Render the app wrapped with both Redux and Auth Context Providers
ReactDOM.render(
  <Provider store={store}>  {/* Redux provider */}
    <AuthProvider>  {/* Your custom AuthProvider */}
      <App />
    </AuthProvider>
  </Provider>,
  document.getElementById('root')
);
