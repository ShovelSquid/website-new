const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

function Header() {

    const pages = ["About", "Projects", "Contact", "Links", "Blog"];

    return <div className="main">
        <Title title="Kaelen Cook" id="main"/>
        <Title title="Artist & Developer" id="sub"/>
        <div id="buttonContainer">
        <div id="buttons">
            {pages.map((page) => (
                <Button key={page} page={page} className="nav" onClick={() => console.log(`You clicked ${page}`)} image={null} />
            ))}
        </div>
        </div>
    </div>
}

function Page() {
    const [value, setValue] = React.useState(0);
    function handleClick() {
        setValue(value + 1);
    }

    return <div>
        <Header />
        <button onClick={handleClick}>Click {value}</button>
    </div>;
}


function Title({title, className, id}) {
    return <h1 id={id ? id : ""} className={className ? className : ""}>{title ? title : "Hello"}</h1>;
}

function Button({image, className, onClick, page}) {
    return <button className={className ? className : "button"} onClick={onClick}>
        {image ? <img src={image} alt="Button Image" /> : page ? page : "Button"}
    </button>;
}


root.render(<Page />);