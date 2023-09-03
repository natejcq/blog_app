import { format } from 'date-fns';

export default function Post({title, summary, cover, content, createdAt}) {
    return (
    <div className="post">
        <div className="image">
            <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fzoranpavlovic.net%2Fwp-content%2Fuploads%2F2017%2F03%2Fclean-code.jpg&f=1&nofb=1&ipt=b542ea48698f259ab04b59bc2ddcb5016a776654a4e0787b6ccab162c6774d5e&ipo=images" alt="" />
        </div>
        <div className="texts">
            <h2>{title}</h2>
            <p className="info"> 
                <a className="Author">ABCD</a>
                <time>{format(new Date(createdAt), 'd MMM yyyy HH:mm')}</time>
            </p>
            <p className="summary">{summary}</p>
        </div>
  </div>
);
}