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
                    <video src={src} autoPlay loop />
                ) : (
                    <img src={src} alt="Full size" />
                )}
                <button className="lightbox-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
}

function Projects({section, onSelect, onPieceChange}) {
    const sections = ["About Me", "Concept Art", "2D Animation", "3D Modeling/Animation", "Games", "Pixel Art", 
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

    // Category switcher, rendered at the top of the left-hand gallery column
    const categoryNav = (
        <div className="projectSection">
            {sections.map((s) => (
                <Interactitle
                    key={s}
                    title={s}
                    className={s === section ? "active" : ""}
                    onClick={() => onSelect(s)}
                />
            ))}
        </div>
    );

    return <ProjectCollection section={section} categoryNav={categoryNav} ready={showContent} onPieceChange={onPieceChange} />;
}

function ProjectCollection({section, categoryNav, ready, onPieceChange}) {
    const filepath = "assets/portfolio/" + section + "/";
    const [visibleCount, setVisibleCount] = React.useState(0);
    const [lightbox, setLightbox] = React.useState({ src: null, type: null });
    // Which gallery item is shown large in the highlight column on the right
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const files = {
        "2D Animation": [
            // { file: "meg_ryan.mp4", description: "A looping 2D character animation exploring squash, stretch, and personality." },
            { file: "fish.gif", description: "A 2D animated character loop showcasing fluid motion and personality." },
            { file: "grude.mp4" },
            { file: "groblin.gif" },
            {
                file: "KCGames.mp4",
                description: `A Studio Logo design that I came up with; gave me hope to keep on going through the grind of game development. Something I really
                want to play more with is the pure white text with thin color gradient highlights, mostly just around the edges. The whole idea of white with 
                subtle blue and red on the edges is really satisfying to me, and I want to someday go really in depth on a shader that renders light properly on
                pure white text, to showcase lights in a way that accentuates the white. Because, you know, when you think about it, white isn't blank, it's all of the 
                colors mixed into one (thanks Newton and your filthy prism, just kidding it actually had to be really clean to reflect all that light), so when
                you showcase some slight colors on the edges of whites, it actually makes it feel MORE white than blank white, because what you're describing visually
                is the LIGHT being emanated, as opposed to the pure RGB color of 1 1 1. I don't know, something cool to think about, and something I want to explore more.`
            },
            {
                file: "Radiation.mp4",
                description: `Particles, lots and lots of particles. This honestly is one of the longer pieces I've done, and not cause of how
                good the overall pose is; in my opinion, it's not that great, but really the particles are pretty awesome. I'm a huge fan of
                animating particles-- whether it be by hand or through VFX like in Unity or Blender, but something about doing it by hand is really cool;
                you sort of get to follow each one through from their birth to their end, and especially in these ones where they loop cleanly you have to
                decide how their birth and end cycle into one another. Or really, how they keep on moving through only 4 frames of motion total (this one I think is 6?) 
                but since it loops, you can continue the path of the individual particles for 8, 12, 24, 120, however many frames you want. Which is neat; it 
                really is corny, but you do follow through and discover the story of each particle. Something you can really get lost in.`
            },
            
            // { file: "Human_Torch_Wout_Fire_Resistance.gif" },
            // { file: "movement.gif" },
            // { file: "Triangle_Shatter.gif" },
            // { file: "father_figure.mp4" },
            // { file: "punch.gif"},
            // { file: "handcules.mp4" },
            // { file: "Man.mp4" },
            // { file: "mcdoodin.mp4" }
        ],
        "3D Modeling/Animation": [
            { file: "interceptor.mp4", description: "A 3D animated sequence focused on motion, weight, and timing." },
            // { file: "robot_walk_cycle.mp4" },
            {
                file: "altar.mp4",
                title: "Flesh Altar",
                description: `Playing around with making stone sculptures, as well as malleable tentacle rigs/models. Fun to texture and animate;
                this was right around when I was just learning to sculpt and texture. Also, not to call out the guy's massive feet, they were normal before
                but I showed this to my brother and accidentally resized them which caused us to have a laugh, and for the fun of it I decided to keep it like that.
                The beauty of art, huh? All done in Blender, with some fun shader node setups for the lights on the ball.`
            },
            {
                file: "Deserted_Robot.mp4",
                title: "Deserted Robot",
                description: `I created the model, texture and rig for this robot in Blender; This was for a concept for a game where you played as a sentient AI in a crash landed ship, merging with the flora 
                and tasked with keeping it safe from rogue parent AI systems that were coming to try to scrap the ship. Breaking free from the programming,
                becoming one with nature, that classic robot sentience story. I'm a huge fan of those types of, I wouldn't say abolitionist, growth-oriented stories?
                Ones where robots, instead of becoming evil and following their programming to the letter, decide to either deviate or grow new patterns that weren't
                explicitly implemented, and they happen to be very harmonious and curious by nature. Recently I started reading Becky Chambers, and her stories are 
                truly wonderful, I believe were a big inspiration for the Wild Robot, which is another of my favorite movies.`
            },
            // { file: "hunsk.mp4" },
            { file: "devil.gif", description: "A 3D model rendered out as an animated turntable." },
            {
                file: "gunGuy.mp4",
                description: `A guy, with a gun. He's gun guy.`
            },
            // { file: "MicroTurret.mp4" },
            // { file: "altar.mp4" },
            // { file: "sledger-full.mp4" },
            // { file: "hammer_showcase.mp4" },
            // { file: "Mikey.mp4" },
            // { file: "devil.gif" }
        ],
        "3D Models": [
            { file: "Leg Bots.png" },
            { file: "MacroTurret.png" },
            { file: "sledger-full.mp4" },
            { file: "Mic Man.png" },
            { file: "ruined_knights.png" },
            { file: "walker.png" },
        ],
        "Concept Art": [
            // { file: "Robot_Types.png", description: "Concept exploration of robot types, silhouettes, and variations." },
            // { file: "Robot_Types_Presentation.png" },
            { 
                file: "Octopourse.png", 
                title: "Doctor Squid", 
                description: `Professor Lin Quy Chi was not always a roboticist; in fact, in their youth, they spent much of their time
                in the outdoors looking at bugs. Finding them to be quite relatable and really decently friendly, they developed an 
                intense love for nature, and dedicated much of their life to immersing themselves in and connecting deeper with the
                world around them. This love lead to frustration when their high school years came around, and they found themselves
                struggling to connect with other students, becoming ostracized for their unusual interests. Linguistics sort of drifted 
                into Lin's lap, yet was a natural fit. They were very good with systems and structural thinking, the inherent rules
                underlying language became utterly fascinating to them; and it gave Lin the tools to be able to communicate their unusual interests effectively with the outside world. 
                After studying Psycholinguistics and Pharmacology at the University of Seattle, Illinois, they became a translator for the UN, working with diplomats and scientists from all over the world.
                Lin found that while they were truly talented at understanding the languages of humans, yet even with all that skill they
                grew a gaping hole in their heart, and longed to translate the languages of animals, creatures, and even the mycelial
                network which lines the entirety of the planet. They set to work creating a neural apparatus, capable of interfacing with
                and automatically creating lexicons and syntactic structures based off of non-human patterns and stimuli; ostracizing themselves
                from the world, instead of being ostracized. This led to the creation of the Psychic Inhabitor, the device which Lin uses
                connected to their brain to communicate with other creatures. Lin communicated with a wide variety of oceanic and woodland
                animals, learning many secrets, including how to build the incredible robotic arms and explosive devices they use to traverse
                the world (the dolphins and squids are really quite talented at engineering). Lin has been forever grateful to nature, to their
                education, and to the world which provides endless beauty and understanding to engage with.`
            },
            {
                file: "entricles3.png",
                title: "Entricles",
                description: `Nefarious woodland fey creatures made out of wood. Created in a pact with the once witch made 
                demon-king Nyoka, these beings are a cross hybrid between spiders and the woods themselves; a type of unholy 
                arachnid made in the spare time of Nyoka which hunts living flesh and converts their organs into wood. They use 
                the mandibles on their heads to grasp their victims after which they can then inject them with a glowing ichorous 
                liquid, melting their insides and reforming them into a stable, long lasting structure. Great for the environment.`
            },
            {
                file: "Paladin_Colors.png",
                description: `Exploration of colors for a paladin character as a part of a game project I was a part of in college. 
                Really the white and the orange was the best one, but I wanted to check out a few other styles to make sure there
                wasn't one that was really cool that we were missing. The black and red eventually led to the red and green for the 
                cursed version, which was interesting as sort of an opposing force to this type of character. The back is way too 
                arched which really bothers me now, especially since I made it a while ago, but I thought it was a good showcase of
                color exploration so I wanted to include it. Really though, they should see a doctor cause that back is messed up.`,
            },
            // { file: "Robot_Silhouettes.png" },
            // // { file: "Helldivers Sketches.png" },
            // // { file: "Design Ideation.png" },
            // // { file: "Trash-Pits.png" },
            // { file: "Antaur.png" },
            // // { file: "Fighter_concept.png" },
            { file: "interceptor concept.png" },
            // // { file: "Glassics.png" },
            // // { file: "Tall_boy.png" },
            // { file: "string.jpeg" },
            // { file: "Shepherd.png" },
            // { file: "Wizard Blasties.png" },
            // { file: "Murder.png" },
            // { file: "Rock_Angels.png" },
            // // { file: "Glasshead.png" },
            // // { file: "Design Sketch.png"},
            // // { file: "Fighter_Slash_Concept.png" },
            // // { file: "bimbus concept.png" },
            // // { file: "ruined_knights.png" },
            // // { file: "Soldier_Concept.png" }
        ],
        "Spritesheets": [
            { file: "boomer_sheet.png", description: "A sprite sheet laying out the animation frames for a game character." },
            { file: "beamup-Sheet.png" },
            // { file: "flyer-expord-light-1.png" },
            { file: "monkey-run-sheet.png" },
            { file: "thorg_sheet.png" },
        ],
        "Illustration": [
            { file: "Glasshead.png" },
            { file: "Murder.png" },
            { file: "Cyborg Hand.png" },
            { file: "string.jpeg" },
            { file: "Shepherd.png" }
        ],
        // "Games": [
        //     { file: "perihelion.mp4", link: "https://shovelsquid.itch.io/perihelion" },
        //     { file: "celestial_combat.mp4", link: "https://shovelsquid.itch.io/celestialcombat" }
        // ],
        "UI Icons": [
            { file: "c4.png", description: "A game UI icon designed to read clearly at small sizes." },
            { file: "heart_hit_sheet.png" },
            { file: "MenuUI.mp4" },
        ],
        "Pixel Art": [
            // { file: "Bamf.gif", description: "An animated pixel-art sprite built frame by frame." },
            // { file: "Crawler.gif" },
            // { file: "enor.gif" },
            {
                file: "GreatWyrm.png",
                description: `Just a big ole, great ole big ole huge ole wyrm, amirite? Yeah. I don't really know what this is, to be honest. Which should scare me,
                but for some reason I feel really fine with it. It's just Wyrmy, my big ole wyrm compatriot. Just floatin around the cosmic abyss, chillin, annihilating planets.
                No biggie. I honestly feel like he'd be absolutely the chillest of fellas, like a real bloke you could sit down with and have a hearty chat, nothing too 
                spiritual, but honestly some real big eye openers, maybe a 7/10 on the depth of emotion scale of chats; and then he'd float on his way and probably munch on your planet
                afterwards. Just a real chill guy, with a mighty appetite. That's the thing about giant cosmic entities; yeah they could be evil and whatnot, but why would they care so much? 
                The fear doesn't come from their malice, it comes from their need to consume, and at the massive scale that they're at, it's not their fault if they want to absorb all of human
                society into the infinite cosmic void. It isn't! They didn't ask to be born that way, you know? If anything, blame the programmers of the universe. They're the real fucked-in-the-heads
                type folks. Am I allowed to swear here? I apologize if I'm not. Anywho. Real fucked-in-the-heads type fellas.`
            },
            {
                file: "MainCharacter.png",
                title: "Knight Portrait",
                description: `This was going to be a 2d pixel art portrait for dialogue in game for the greatest most spectacular nonexistent game that
                never was. The idea was that you're a corporate knight in the mid-to-near future, working for McDonald's or whatever other massive corporation is currently
                dominating the hemisphere. You know, there's not many rights, there's the illusion of control, of free will, but all of that comes through in the form of what 
                apps you scroll, what reels you engage with. They send you into the mines, or really to offshore planets to secure mining bases and export resources back to Corporate HQ,
                and they pay you a practically minimum wage in the good ole McDonald's dormitories to make you feel like you're really securing a living. Trying to capture the essence
                of gig workers, like doordashers, if they were feudal knights. I think it's a fun concept, and I'm still trying to make it happen, one day at a time. Oh, and the CEOs you work for
                are massive post-human entities that have far evolved beyond the scope of the earth, and now drift in the cosmos consuming energy with their massive tentacles. They're the real villains,
                but you're forced to fight other knights because at the end of the day you need that paycheck. Your plants aren't gonna water themselves, you know?`
            },
            {
                file: "Cruse.png",
                title: "Knight Portrait 2",
                description: `A rough concept for a selection screen for choosing your character. Trying to get a feel for the general outline/size that the 
                character was going to fit in.`
            },
            {
                file: "Banner.png",
                title: "Infinite Cosmic Banner",
                description: `For a while, I've sort of wanted to get into Youtube as a science content communicator, but then I realized that I don't know
                much science. Don't get me wrong, I love science, physics and chemistry specifically, but I only studied it passingly in college, and don't have 
                a crazy degree in it or anything. I would absolutely love to talk about the concepts and topics that I'm interested in, because genuinely they're a little
                bit niche (carbon nanotubes anyone??! biofuels!!?), but spreading misinformation is also one of the topics highest on my list of things I don't want to do 
                on a daily basis, so I sort of shrugged it off to the side for a perpetual amount of time. That being said, this was the type of "character" I came up with
                to talk to the audience through. Sort of an infinitely massive cosmic entity that is far removed from humanity, but way too invested in the crazy stuff that's
                happening in our world to not get super obsessed and watch over everything that's happening. Sort of a more comedic take on cosmic horror; I love the idea that
                we aren't alone in the universe and that we do share space with the most infinite and timeless of Old Gods, but instead of being evil or malevolent they just kinda
                don't really care all that much. Or are like, 'huh, neat.' It gives me great peace.`
            },
            {
                file: "Eye1.png",
                title: "Eyeball Character",
                description: `Further along on the cosmic character design; this is an up close rendering of the character that would show during the video
                when explaining topics. They have all the different expressions; confused, focused, surprised, disappointed; and I'd cycle through all of them depending on
                the content that was being discussed. Could honestly work as another dialogue portrait, like the Knight one earlier, but for the CEO of McDonald's that you work for
                in the mid-to-near future.`
            },
            { file: "cursed_paladin_death.gif" },
            // { file: "ship.gif" },
            // { file: "Walking biped.gif" },
            { file: "Ghoul.gif" },
            // { file: "Reload.gif" }
        ],
        "Weird Western": [
            { file: "Boomer.gif" },
            { file: "dingus.gif" },
            { file: "evolution.gif" },
            { file: "Farm_enemy.gif" },
            { file: "Thorg.gif" },
            { file: "Thunkalunkadunkus.gif" }
        ],
        "Games": [
            { file: "perihelion.mp4", link: "https://shovelsquid.itch.io/perihelion", description: "Gameplay from a personal game project. Use the link to play it." },
            { 
                file: "celestial_combat.mp4",
                description: `Gameplay from Celestial Combat, and endless runner/shooter/blatant Galaga clone I and two other people made in a weeklong sprint in college. 
                All of the game art assets you see are mine, I created the void/stars in the background, the ship sprites, the bullet sprites, as well as the healthbar, and VFX. I 
                programmed all of the hit VFX and game juice, the screenshake, particle effects, healthbar flying off when you get hurt, etc. This was coded in Phaser, which is a 
                game library for Javascript (and a pretty jank one at that, but great for web games! Simple, web games. Very simple). Very fun! The original concept was to record your 
                keystrokes and have your ghost reappear the next round over, accumulating more and more with more ghosts, both helping and hindering your performance, but it was scrapped for time.
                Definitely a concept I'd love to return to in the future though.`, 
                link: "https://shovelsquid.itch.io/celestialcombat" 
            },
            { file: "GameFoot.mp4" },
            { file: "Gameplay Showcase.mp4", link: "https://store.steampowered.com/app/2968800/SLEDGE/" }
        ]
    }
    const projects = (files[section] || []).map(item => ({
        file: typeof item === 'string' ? item : item.file,
        link: typeof item === 'object' ? item.link : null,
        description: typeof item === 'object' ? item.description : null,
        title: (typeof item === 'object' && item.title)
            ? item.title
            : (typeof item === 'string' ? item : item.file)
                .replace(/\.(jpg|jpeg|png|gif|mp4|webm)$/, '')
                .replace(/-|_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())
    }));

    // Reset the highlighted item whenever the category changes
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [section]);

    // Progressive rendering - add gallery thumbnails gradually
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

    const isVideoFile = (file) => file.endsWith('.mp4') || file.endsWith('.webm');

    // Render a project's media.
    //   mode "thumb"     -> non-interactive preview; the surrounding tile handles selection
    //   mode "highlight" -> large view; clicking opens the full-size lightbox
    const renderMedia = (project, mode) => {
        const isHighlight = mode === 'highlight';
        const src = filepath + project.file;

        if (isVideoFile(project.file)) {
            return (
                <video
                    src={src}
                    loop
                    muted
                    autoPlay
                    playsInline
                    preload="metadata"
                    onClick={isHighlight ? () => openLightbox(src, 'video') : undefined}
                    style={isHighlight ? {cursor: 'zoom-in'} : {pointerEvents: 'none'}}
                />
            );
        }

        return (
            <img
                src={src}
                alt={project.title}
                loading="lazy"
                onClick={isHighlight ? () => openLightbox(src, 'image') : undefined}
                style={isHighlight ? {cursor: 'zoom-in'} : {pointerEvents: 'none'}}
            />
        );
    };

    const selected = projects[selectedIndex] || projects[0];
    // "About Me" is a special category that shows the bio in the highlight column
    const isAbout = section === "About Me";
    const selectedTitle = isAbout ? "About Me" : (selected ? selected.title : null);

    // Report the highlighted piece's title up so the page title can show it
    React.useEffect(() => {
        if (onPieceChange) onPieceChange(selectedTitle);
    }, [selectedTitle, onPieceChange]);

    return (
        <>
            <Lightbox src={lightbox.src} type={lightbox.type} onClose={closeLightbox} />
            <div className="projectsLayout">
                {/* Left: category switcher + gallery thumbnails */}
                <div className="galleryColumn">
                    {categoryNav}
                    {!isAbout && ready && (
                        <div className="projectCollection">
                            {projects.slice(0, visibleCount).map((project, index) => (
                                <div
                                    key={index}
                                    className={"project" + (index === selectedIndex ? " selected" : "")}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <h3>{project.title}</h3>
                                    {renderMedia(project, 'thumb')}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: highlighted view + description (or the About Me bio) */}
                <div className="highlightColumn">
                    {isAbout ? (
                        <div className="highlight">
                            <div className="highlight-media">
                                <img src="assets/images/me.jpg" alt="Kaelen Cook" />
                            </div>
                            <h3 className="highlight-title">About Me</h3>
                            <p className="highlight-description">Hello! I'm Kaelen, an artist/developer hybrid. I'm interested in making all kinds of games! I do ui, vfx, environments, characters, stories, and more. I love movies, comedy, and making games feel fun to play.</p>
                            <p className="highlight-description">If you're interested in working together, please send me an email at <a href="mailto:kaelen1cook@gmail.com">kaelen1cook@gmail.com</a></p>
                        </div>
                    ) : (
                        ready && selected && (
                            <div className="highlight">
                                <div className="highlight-media">
                                    {renderMedia(selected, 'highlight')}
                                </div>
                                <h3 className="highlight-title">{selected.title}</h3>
                                <p className="highlight-description">
                                    {selected.description || `A piece from my ${section} collection.`}
                                </p>
                                {selected.link && (
                                    <a
                                        className="highlight-link"
                                        href={selected.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open project ↗
                                    </a>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

function About() {
  return <div id="aboutContent">
    <img src="assets/images/me.jpg" alt="Kaelen Cook"></img>
    <p>Hello! I'm Kaelen, an artist/developer hybrid. I'm interested in making all kinds of games! I do ui, vfx, environments, characters, stories, and more. I love movies, comedy, and making games feel fun to play.</p>
    <p>If you're interested in working together, please send me an email at <a href="mailto:kaelen1cook@gmail.com">kaelen1cook@gmail.com</a></p>
  </div>
}

function Contact() {
  return <div id="contactContent">
    <div id="aboutContent">
        <p>You can send me an email at:</p>
        <ul>
            <li>Email: <a href="mailto:kaelen1cook@gmail.com">kaelen1cook@gmail.com</a></li>
        </ul>
        <p>Or find me on discord:</p>
        <ul>
            <li>Discord: <a href="https://discord.com/">ShovelSquid</a></li>
        </ul>
        <p>Here are some of my other links:</p>
        <ul>
            <li><a href="https://sketchfab.com/shovelsquid/">Sketchfab</a></li>
            <li><a href="https://itch.io/profile/shovelsquid/">Itch.io</a></li>
        </ul>

        </div>
  {/* <div id="contactButtons">
    <div id="buttons">
      <ContactButton id="contact"/>
      <ContactButton id="contact"/>
      <ContactButton id="contact"/>
  </div></div> */}
  </div>
}

function Header() {

    const pages = ["About", "Projects", "Contact"];
    // Projects is the base/landing view
    const [state, setState] = React.useState("projects");
    const [section, setSection] = React.useState("2D Animation");
    // Title of the currently highlighted piece, reported up from ProjectCollection
    const [pieceTitle, setPieceTitle] = React.useState(null);
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
        // if (page == "Contact") {
        //     window.location.href = "#contact";
        //     setState("contact");
        // }
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
        setPieceTitle(null); // fall back to the category name until the new piece reports in
        console.log(`Section selected: ${section}`); // Add this to debug
    }
    if (state === "about") mainTitle = "About Me";
    // In projects, the title is the highlighted piece (falls back to the category name)
    if (state === "projects") mainTitle = pieceTitle || section;
    if (state === "contact") mainTitle = "Contact Me";
    if (state === "links") mainTitle = "Links";
    if (state === "blog") mainTitle = "Blog";
    return <div className={`main ${state || ''}`}>
        <PullDrawer onNavigate={handleClick} onHome={back} />
        {state === null && <Gallery></Gallery>}
        <Title title={mainTitle} id="main" />
        {/* <Title title={state ? state.charAt(0).toUpperCase() + state.slice(1) : subTitle} id="sub"/> */}
        {state === "about" && <About />}
        {state === "projects" && <Projects section={section} onSelect={selectSection} onPieceChange={setPieceTitle}/>}
        {state === "contact" && <Contact />}
        {/* {state === "links" && <Title title="Links" />} */}
        {/* {state === "blog" && <Title title="Blog" />} */}
        {/* <div id="buttonContainer">
        <div id="buttons">
            <AboutButton id="about" onClick={() => handleClick("About")} page={'About'}/>
            <ProjectsButton id="projects" onClick={() => handleClick("Projects")} page={'Projects'}/>
            <ContactButton id="contact" onClick={() => handleClick("Contact")} page={'Contact'}/>
        </div>
        </div> */}
    </div>
}

function PullDrawer({onNavigate, onHome}) {
    const items = ["About", "Projects"];
    const externalLinks = [
        { label: "Sketchfab", url: "https://sketchfab.com/shovelsquid/" },
        { label: "Itch.io", url: "https://shovelsquid.itch.io/" }
    ];
    return (
        <div className="pull-drawer" aria-hidden="false">
            <div
                className="pull-circle"
                role="button"
                tabIndex={0}
                aria-label="Home"
                onClick={() => onHome && onHome()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onHome && onHome(); }}
            ></div>
            <div className="pull-panel" role="menu" aria-label="Quick Links">
                <ul>
                    <li key="home" role="menuitem" onClick={() => onHome && onHome()}>Home</li>
                    {items.map((it, i) => (
                        <li key={i} role="menuitem" onClick={() => onNavigate && onNavigate(it)}>{it}</li>
                    ))}
                    {externalLinks.map((link, i) => (
                        <li key={`ext-${i}`} role="menuitem">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function Gallery() {
    const galleryImages = [
        'assets/final/fish.gif',
        'assets/final/Deserted_Robot.mp4',
        // 'assets/final/walk_render.mp4',
        'assets/portfolio/Pixel Art/Walking biped.gif',
        'assets/portfolio/3D Models/Walker.png',
        // 'assets/portfolio/Weird Western/dingus.gif',
        'assets/portfolio/Pixel Art/Bamf.gif',
        'assets/portfolio/Concept Art/Shepherd.png',
        'assets/portfolio/2D Animation/grude.mp4',
        'assets/final/Droids.png',
        'assets/final/wizard_animation_death.gif',
        'assets/final/Enviro.png',
        // 'assets/final/clear_render.mp4',
        'assets/final/altar.mp4',
        'assets/final/Heart-UI.png',
        'assets/final/GameDev.mp4',
        // 'assets/final/Gameplay Showcase.mp4'
        // 'assets/final/optionA.mp4'
    ];
    
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    
    const goToImage = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 300);
    };
    
    const nextImage = () => {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        goToImage(nextIndex);
    };
    
    const prevImage = () => {
        const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        goToImage(nextIndex);
    };
    
    // Helper function to check if file is a video
    const isVideo = (filename) => {
        return filename.endsWith('.mp4') || filename.endsWith('.webm') || filename.endsWith('.mov');
    };
    
    const currentMedia = galleryImages[currentIndex];
    const isCurrentVideo = isVideo(currentMedia);
    
    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);
    
    return (
        <div id="gallery">
            <button className="gallery-nav-button left" onClick={prevImage}>
                <svg 
                    className="icon icon-backicon"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 300 300" 
                    width="50" 
                    height="50"
                >
                    <path 
                        id="gallery-left-1" 
                        d="M103.118153,104.717394C88.396377,118.302176,54.045567,150,54.045567,150s135.825909,0,135.825909,0" 
                        transform="translate(28.041479-.942019)" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        id="gallery-left-2" 
                        d="M103.118154,198.042939c0,0-36.35081-36.478021-51.072586-47.604792" 
                        transform="translate(30.041478-1.380166)" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                </svg>
            </button>
            
            {isCurrentVideo ? (
                <video 
                    key={currentMedia}
                    src={currentMedia}
                    className={isTransitioning ? 'gallery-transition' : ''}
                    autoPlay
                    loop
                    muted
                />
            ) : (
                <img 
                    src={currentMedia}
                    className={isTransitioning ? 'gallery-transition' : ''}
                />
            )}
            
            <button className="gallery-nav-button right" onClick={nextImage}>
                <svg 
                    className="icon icon-backicon"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 300 300" 
                    width="50" 
                    height="50"
                >
                    <path 
                        id="gallery-right-1" 
                        d="M103.118153,104.717394C88.396377,118.302176,54.045567,150,54.045567,150s135.825909,0,135.825909,0" 
                        transform="translate(28.041479-.942019) scale(-1, 1) translate(-300, 0)" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        id="gallery-right-2" 
                        d="M103.118154,198.042939c0,0-36.35081-36.478021-51.072586-47.604792" 
                        transform="translate(30.041478-1.380166) scale(-1, 1) translate(-300, 0)" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                </svg>
            </button>
            
            <div className="gallery-thumbnails">
                {galleryImages.map((img, index) => {
                    const isVideoThumb = isVideo(img);
                    return isVideoThumb ? (
                        <video
                            key={index}
                            src={img}
                            className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                            muted
                            loop
                            autoPlay
                        />
                    ) : (
                        <img
                            key={index}
                            src={img}
                            className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                        />
                    );
                })}
            </div>
        </div>
    );
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