const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

// Lightbox component for viewing media in full size
function Lightbox({src, type, onClose}) {
    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!src) return null;

    return (
        <div className="lightbox" onClick={onClose}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                {type === 'video' ? (
                    <video src={src} controls autoPlay loop />
                ) : (
                    <img src={src} alt="Full size" />
                )}
                <button className="lightbox-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
}

function Projects({section, onSelect}) {
    const sections = ["3D Animation", "2D Animation", "Concept Art", "Illustration", "Games", "Pixel Art", "Weird Western",
    ];
    const [isPending, startTransition] = React.useTransition();
    const [showContent, setShowContent] = React.useState(false);

    // Load content as low-priority update
    React.useEffect(() => {
        // Wait for next frame so CSS animations can start
        requestAnimationFrame(() => {
            // Mark this state update as non-urgent
            startTransition(() => {
                setShowContent(true);
            });
        });
    }, []);

    // function onSelect(section) {
    //     setSection(section);
    // }
    // const sections = ["Nople"];
    return <div className="projectSection">
        {sections.map((section) => (
            <Interactitle key={section} title={section} onClick={() => onSelect(section)} />
        ))}
        {showContent && <ProjectCollection section={section} />}
    </div>;
}

function ProjectCollection({section}) {
    const filepath = "assets/portfolio/" + section + "/";
    const [proj, setProj] = React.useState(null);
    const [visibleCount, setVisibleCount] = React.useState(0);
    const [lightbox, setLightbox] = React.useState({ src: null, type: null });
    
    const files = {
        "3D Animation": [
            "interceptor.mp4",
            "walk_cycle_proper.mp4",
            "altar.mp4",
            "sledger-full.mp4",
            "first_person_animations.mp4",
            "devil.gif"
        ],
        "2D Animation": [
          "groblin.gif",
          "Human_Torch_Wout_Fire_Resistance.gif",
          "movement.gif",
          "Triangle_Shatter.gif",
          "father_figure.mp4",
          "handcules.mp4",
          "Man.mp4",
          "mcdoodin.mp4",
        ],
        "Concept Art": [
            "Fighter_concepts.png",
            "Glassics.png",
            "Fighter_Slash_Concept.png",
            "bimbus concept.png",
            "ruined_knights.png",
            "Soldier_Concept.png"
        ],
        "Illustration": [
            "Glasshead.png",
            "Plunder.png",
            "Cyborg Hand.png",
            "string.jpeg",
            "Shepherd.png",
        ],
        "Games": [
            "perihelion.mp4",
            "celestial_combat.mp4"
        ],
        "Pixel Art": [
            "Bamf.gif",
            "cursed_paladin_death.gif",
            "ship.gif",
            "Walking biped.gif",
            "Ghoul.gif",
            "Reload.gif"
        ],
        "Weird Western": [
          "Boomer.gif",
          "dingus.gif",
          "evolution.gif",
          "Farm_enemy.gif",
          "Thorg.gif",
          "Thunkalunkadunkus.gif"
        ]
    }
    const projects = files[section].map(file => ({
        file: file,
        title: file.replace(/\.(jpg|jpeg|png|gif|mp4|webm)$/, '').replace(/-|_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }));
    
    // Progressive rendering - add items gradually
    React.useEffect(() => {
        setVisibleCount(0);
        const incrementVisible = () => {
            setVisibleCount(prev => {
                if (prev < projects.length) {
                    requestAnimationFrame(incrementVisible);
                    return prev + 1;
                }
                return prev;
            });
        };
        requestAnimationFrame(incrementVisible);
    }, [section, projects.length]);
    
    const openLightbox = (src, type) => {
        setLightbox({ src, type });
    };

    const closeLightbox = () => {
        setLightbox({ src: null, type: null });
    };
    
    return (
        <>
            <Lightbox src={lightbox.src} type={lightbox.type} onClose={closeLightbox} />
            <div className="projectCollection">
                {projects.slice(0, visibleCount).map((project, index) => (
                    <div key={index} className={proj ? proj : "project"}>
                        <h3>{project.title}</h3>
                        {project.file.endsWith('.mp4') || project.file.endsWith('.webm') ? (
                            <video 
                                src={filepath + project.file} 
                                onClick={() => openLightbox(filepath + project.file, 'video')}
                                controls 
                                loop 
                                muted 
                                autoPlay
                                preload="metadata"
                                style={{cursor: 'pointer'}}
                            />
                        ) : (
                            <img 
                                src={filepath + project.file} 
                                alt={project.title} 
                                loading="lazy"
                                onClick={() => openLightbox(filepath + project.file, 'image')}
                                style={{cursor: 'pointer'}}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

function About() {
  return <div id="aboutContent">
    <p>Hello! I'm Kaelen Cook, an artist and developer with a passion for creating immersive experiences through 3D animation, concept art, and game development. With a background in both art and technology, I strive to blend creativity with technical skills to bring ideas to life.</p>
    <p>My journey began with a fascination for storytelling and visual arts, which led me to explore various mediums and techniques. Over the years, I've honed my skills in 3D modeling, animation, and digital painting, allowing me to create compelling characters and environments.</p>
    <p>In addition to my artistic pursuits, I have a strong interest in game development. I enjoy designing interactive experiences that engage players and challenge their perceptions. Whether it's through intricate gameplay mechanics or captivating narratives, I aim to create games that leave a lasting impact.</p>
    <p>When I'm not immersed in my work, I enjoy exploring new technologies, collaborating with fellow creatives, and staying up-to-date with industry trends. I'm always eager to learn and grow, pushing the boundaries of what's possible in the world of art and development.</p>
    <p>Thank you for visiting my portfolio! Feel free to explore my projects and reach out if you'd like to connect or collaborate.</p>
  </div>
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
        {state !== null && <BackButton id="back" onClick={back} page={'BackIcon'}/>}
        {state === "about" && <About />}
        {state === "projects" && <Projects section={section} onSelect={selectSection}/>}
        {/* {state === "contact" && <Title title="Contact Me" />} */}
        {/* {state === "links" && <Title title="Links" />} */}
        {/* {state === "blog" && <Title title="Blog" />} */}
        <div id="buttonContainer">
        <div id="buttons">
            <AboutButton id="about" onClick={() => handleClick("About")} page={'About'}/>
            <ProjectsButton id="projects" onClick={() => handleClick("Projects")} page={'Projects'}/>
            <ContactButton id="contact" onClick={() => handleClick("Contact")} page={'Contact'}/>
            {/* {pages.map((page) => (
                <Button key={page} page={page} id={page.toLowerCase()} className="nav" onClick={() => handleClick(page)} image={"assets/icons/"+page+".svg"} />
            ))} */}
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
        <Header />
        <BG />
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

function BackButton({image, className, onClick, page, id}) {
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

function AboutButton({image, className, onClick, page, id}) {
    return <button className={className ? className : "button"} id={id} onClick={onClick}>
        <svg 
            className="icon icon-about"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 300" 
            width="50" 
            height="50"
        >
            <path 
                id="e5EjUZ76vzl2" 
                d="M100,236.70083v-24.088874c0-15.836314,0-83.241914-50-83.241914s-50,67.4056-50,83.241914Q0,236.70083,0,236.70083t100,0" 
                transform="translate(100 0)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <g 
                id="e5EjUZ76vzl3_to" 
                style={{
                    offsetPath: "path('M150,95.640606Q142.134284,92.611404,135.781771,97.220409Q135.781771,97.220409,135.781771,97.220409C140.239477,93.146955,146.737799,93.817647,150,95.640606')",
                    offsetRotate: "0deg"
                }}
            >
                <ellipse 
                    rx="29.418776" 
                    ry="27.096241" 
                    transform="translate(0,0)" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4"
                />
            </g>
            <g 
                transform="matrix(1.123989 0 0 1.123989 6.549419 6.16794)" 
                mask="url(#e5EjUZ76vzl6)"
            >
                <g 
                    id="e5EjUZ76vzl5_to" 
                    style={{
                        offsetPath: "path('M158.876765,176.046602C255.252646,178.536946,214.675031,119.288851,193.039173,90.008197C215.626804,96.438676,221.702547,107.099665,221.702551,119.288854Q221.837762,97.92846,193.039173,90.008197C229.830311,178.736287,195.610596,193.808909,158.876765,176.046602')",
                        offsetRotate: "0deg"
                    }}
                >
                    <ellipse 
                        rx="29.418776" 
                        ry="27.096241" 
                        transform="scale(0.449848,0.449848) translate(0,0)" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8"
                    />
                </g>
                <mask 
                    id="e5EjUZ76vzl6" 
                    masktype="luminance" 
                    x="-150%" 
                    y="-150%" 
                    height="400%" 
                    width="400%"
                >
                    <rect 
                        width="48.538102" 
                        height="50.322591" 
                        rx="0" 
                        ry="0" 
                        transform="matrix(2.234249 0 0 2.789022 172.110742 64.751635)" 
                        fill="#d2dbed" 
                        strokeWidth="0"
                    />
                </mask>
            </g>
        </svg>
    </button>;
}

function ProjectsButton({ image, className, onClick, page, id }) {
  return (
    <button className={className ? className : "button"} id={id} onClick={onClick}>
      <svg id="ezmQEsx5krU1" className="icon icon-projects" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shapeRendering="geometricPrecision">
        <g id="ezmQEsx5krU2_to" transform="translate(115.711537,144.207123)">
          <g id="ezmQEsx5krU2_tr" transform="rotate(0)">
            <g transform="translate(-115.711536,-144.207123)">
              <path 
                d="M83.182916,105.90532v115.666178q149.548726,0,149.548726,0t-.252384-115.666178h-149.296342" 
                transform="matrix(0 1-1 0 279.449945-13.750162)" 
                fill="rgba(255,255,255,0.46)" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <rect 
                width="34.700822" 
                height="31.885102" 
                rx="0" 
                ry="0" 
                transform="translate(72.910969 94.182927)" 
                fill="rgba(210,219,237,0.29)" 
                strokeWidth="0"
              />
              <ellipse 
                rx="28.800745" 
                ry="28.361442" 
                transform="translate(131.576307 126.068029)" 
                fill="rgba(249,141,141,0.44)" 
                strokeWidth="0"
              />
              <polygon 
                points="0,-24.58526 23.381971,-7.597263 14.450853,19.889893 -14.450853,19.889893 -23.381971,-7.597263 0,-24.58526" 
                transform="matrix(.917907-.396796 0.396796 0.917907 86.356835 176.564601)" 
                fill="rgba(252,240,155,0.39)" 
                strokeWidth="0"
              />
            </g>
          </g>
        </g>
        <g id="ezmQEsx5krU7_to" transform="translate(165.56147,137.370564)">
          <g id="ezmQEsx5krU7_tr" transform="rotate(0)">
            <g transform="translate(-144.970521,-107.464389)">
              <path 
                style={{isolation: "isolate"}}
                d="M83.182916,105.90532v115.666178q149.548726,0,149.548726,0t-.252384-115.666178h-149.296342" 
                transform="matrix(0 1-1 0 307.868317-22.731685)" 
                fill="#fff" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h63.459087" 
                transform="translate(1.437414 16.620056)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h87.186606" 
                transform="translate(1.437414 37.272124)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h87.186606" 
                transform="translate(1.669015 52.834976)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h63.227486" 
                transform="translate(1.669015 45.352835)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h63.227486" 
                transform="translate(1.669015 60.317117)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h31.729543" 
                transform="translate(1.437414 110.597104)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                d="M98.86759,70.19227h67.608683" 
                transform="translate(1.669015 117.480674)" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              />
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
}
function ContactButton({ image, className, onClick, page, id }) {
  return (
    <button className={className ? className : "button"} id={id} onClick={onClick}>
      <svg id="epfso48PGta1" className="icon icon-contact" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shapeRendering="geometricPrecision">
        <g id="epfso48PGta2_tr" transform="translate(151.873475,147.44254) rotate(0)">
          <g id="epfso48PGta2_ts" transform="scale(1,1)">
            <path id="epfso48PGta2" d="M65.56857,96.144461v86.383601q0,20.985845,30.936751,20.985845c9.176874,0,10.330003,8.989249,10.330003,23.995475c20.362202,0,74.204649-23.995475,105.687274-23.995475q32.339392,0,32.339392-20.985845c0-20.985845.280297-86.097472.28619-86.383601.304499-14.784459-16.196317-14.784459-16.196317-14.784459q0,0-147.436766-.592895Q65.56857,81.991211,65.56857,96.144461" transform="translate(-151.873472,-147.442536)" fill="none" stroke="currentColor" strokeWidth="4"/>
          </g>
        </g>
      </svg>
    </button>
  );
}


root.render(<Page />);