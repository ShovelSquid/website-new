const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

function Header() {

    const pages = ["About", "Projects", "Contact", "Links", "Blog"];
    const [state, setState] = React.useState(null);

    function handleClick(page) {
        if (page == "About") {
            window.location.href = "#about";
            setState("about");
        }
        if (page == "Projects") {
            window.location.href = "#projects";
            setState("projects");
        }
        if (page == "Contact") {
            window.location.href = "#contact";
            setState("contact");
        }
        if (page == "Links") {
            window.location.href = "#links";
            setState("links");
        }
        if (page == "Blog") {
            window.location.href = "#blog";
            setState("blog");
        }
        console.log(`You clicked ${page}`);
    }

    return <div className={`main ${state || ''}`}>
        <Title title="Kaelen Cook" id="main" />
        <Title title="Artist & Developer" id="sub"/>
        <div id="buttonContainer">
        <div id="buttons">
            {pages.map((page) => (
                <Button key={page} page={page} className="nav" onClick={() => handleClick(page)} image={"assets/icons/"+page+".svg"} />
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
        {/* <button onClick={handleClick}>Click {value}</button> */}
    </div>;
}


function Title({title, className, id}) {
    return <h1 id={id ? id : ""} className={className ? className : ""}>{title ? title : "Hello"}</h1>;
}

function Button({image, className, onClick, page}) {
    const [svgContent, setSvgContent] = React.useState('');

    React.useEffect(() => {
        // Load SVG file and modify it for CSS control
        fetch(`assets/icons/${page}.svg`)
            .then(response => response.text())
            .then(svgText => {
                // Modify SVG to use currentColor for CSS control
                const modifiedSvg = svgText
                    .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                    .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
                    .replace(/<svg[^>]*>/, match => 
                        match.replace(/width="[^"]*"/, 'width="50"')
                             .replace(/height="[^"]*"/, 'height="50"')
                    );
                setSvgContent(modifiedSvg);
            })
            .catch(() => {
                // Fallback if file doesn't exist
                setSvgContent(`<svg width="50" height="50" viewBox="0 0 24 24"><text x="12" y="12" text-anchor="middle" fill="currentColor">${page}</text></svg>`);
            });
    }, [page]);

    return <button className={className ? className : "button"} onClick={onClick}>
        <div 
            className={`icon icon-${page?.toLowerCase()}`}
            dangerouslySetInnerHTML={{__html: svgContent}} 
        />
    </button>;
}


root.render(<Page />);