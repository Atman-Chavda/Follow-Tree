import {useState} from 'react'
import axios from 'axios'

function Post() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
  
    const handlePost = async () => {
      try {
        const response = await axios.post("http://localhost:5555/post/createpost", {
          title,
          description,
        },{withCredentials: true});
        if (response.data.success) {
          setMessage("Post successful!");
        } else {
          setMessage("Post failed. Please check your credentials.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again later.");
      }
    };
  
    return (
      <div className="App">
        <header className="App-header">
          <h1>Post</h1>
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handlePost}>Post</button>
          <p>{message}</p>
        </header>
      </div>
    );
  }
  
  export default Post;
  