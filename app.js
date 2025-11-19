const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

function Projects({section, onSelect}) {
    const sections = ["3D Animation", "Concept Art", "Development", "Photography", 
                        "Graphic Design", "Writing", "Game Development", "Web Development", 
                        "Animation", "UI/UX Design", "Music Composition", "Video Production", 
                        "3D Modeling", "Motion Graphics", "Sound Design", "Interactive Media"
    ];

    // function onSelect(section) {
    //     setSection(section);
    // }
    // const sections = ["Nople"];
    return <div className="projectSection">
        {sections.map((section) => (
            <Interactitle key={section} title={section} onClick={() => onSelect(section)} />
        ))}
    </div>;
}

function Header() {

    const pages = ["About", "Projects", "Contact"];
    const [state, setState] = React.useState(null);
    const [section, setSection] = React.useState("3D Animation");
    let content = null;
    let mainTitle = "Kaelen Cook";
    let subTitle = "Artist & Developer";

    function handleClick(page) {
        if (page == "About") {
            window.location.href = "#about";
            setState("about");
            content = <Title title="About Me" />;
            console.log()
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

    function back() {
        window.location.href = "#";
        setState(null);
        // setSection(null);
    }

    function selectSection(section) {
        setSection(section);
        console.log(`Section selected: ${section}`); // Add this to debug
    }
    if (state === "about") mainTitle = "About Me";
    if (state === "projects" && section) mainTitle = section;  // Use the section state here
    if (state === "contact") mainTitle = "Contact Me";
    if (state === "links") mainTitle = "Links";
    if (state === "blog") mainTitle = "Blog";
    return <div className={`main ${state || ''}`}>
        <Title title={mainTitle} id="main" />
        <Title title={state ? state.charAt(0).toUpperCase() + state.slice(1) : subTitle} id="sub"/>
        {state !== null && <SexyButton id="back" onClick={back} page={'BackIcon'}/>}
        {/* {state === "about" && <Title title="About Me" />} */}
        {state === "projects" && <Projects section={section} onSelect={selectSection}/>}
        {/* {state === "contact" && <Title title="Contact Me" />} */}
        {/* {state === "links" && <Title title="Links" />} */}
        {/* {state === "blog" && <Title title="Blog" />} */}
        <div id="buttonContainer">
        <div id="buttons">
            {pages.map((page) => (
                <Button key={page} page={page} className="nav" onClick={() => handleClick(page)} image={"assets/icons/"+page+".svg"} />
            ))}
        </div>
        </div>
    </div>
}

function BG() {
    return <div id="bg">
        <img src="assets/images/roto.gif" alt="Background" />
    </div>;
}

function Page() {
    const [value, setValue] = React.useState(0);
    function handleClick() {
        setValue(value + 1);
    }

    return <div>
        <BG />
        <Header />
        {/* <button onClick={handleClick}>Click {value}</button> */}
    </div>;
}


function Title({title, className, id}) {
    return <h1 id={id ? id : ""} className={className ? className : ""}>{title ? title : "Hello"}</h1>;
}

function Interactitle({title, className, id, onClick}) {
    return <h1 id={id ? id : ""} className={className ? className : ""} onClick={onClick}>{title ? title : "Hello"}</h1>;
}

function BasicButton({className, id, onClick, title}) {
    return <button className={className} id={id} onClick={onClick}>{title ? title : "Click Me"}</button>;
}

function Button({image, className, onClick, page, id}) {
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

    return <button className={className ? className : "button"} id={id} onClick={onClick}>
        <div 
            className={`icon icon-${page?.toLowerCase()}`}
            dangerouslySetInnerHTML={{__html: svgContent}} 
        />
    </button>;
}

function SexyButton({image, className, onClick, page, id}) {
    return <button className={className ? className : "button"} id={id} onClick={onClick}>
        <svg 
            className="icon icon-backicon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 300" 
            width="50" 
            height="50"
        >
            <path 
                id="ePhODi7nsvp3" 
                d="M103.118153,104.717394C88.396377,118.302176,54.045567,150,54.045567,150s135.825909,0,135.825909,0" 
                transform="translate(28.041479-.942019)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                id="ePhODi7nsvp4" 
                d="M103.118154,198.042939c0,0-36.35081-36.478021-51.072586-47.604792" 
                transform="translate(30.041478-1.380166)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
            />
        </svg>
    </button>;
}



root.render(<Page />);