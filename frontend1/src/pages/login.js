import {useState} from 'react'
import axios from 'axios'



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  
    const handleLogin = async () => {
      try {
        const response = await axios.post("http://localhost:5555/user/login", {
          email,
          password,
        },{withCredentials: true});
        if (response.data.success) {
          setMessage("Login successful!");
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again later.");
      }
    };
  
    return (
      <div className="App">
        <header className="App-header">
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>{message}</p>
        </header>
      </div>
    );
  }
  
  export default Login;
  