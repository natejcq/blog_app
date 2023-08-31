export default function Post(){
    return (
    <div className="post">
        <div className="image">
            <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fzoranpavlovic.net%2Fwp-content%2Fuploads%2F2017%2F03%2Fclean-code.jpg&f=1&nofb=1&ipt=b542ea48698f259ab04b59bc2ddcb5016a776654a4e0787b6ccab162c6774d5e&ipo=images" alt="" />
        </div>
        <div className="texts">
            <h2>Best practices for Clean Code</h2>
            <p className="info"> 
                <a className="Author">ABCD</a>
                <time>2023-01-16 16:45</time>
            </p>
            <p className="summary">Clean code is a set of programming practices that emphasize the readability, maintainability, and simplicity of code.</p>
        </div>
  </div>
);
}