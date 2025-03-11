import React, { useState, useEffect } from 'react';
import './MusicMain.css';

const collaboratorsData = [
    {
        id: 1,
        name: 'Jamesteria',
        role: 'Singer, Songwriter, Artist',
        img: "https://i.scdn.co/image/ab67616100005174fd060d136f18a6037705fa48",
        detailImg: "https://i.scdn.co/image/ab67616100005174fd060d136f18a6037705fa48",
        pages: [
            {
                content:
                    'Jamesteria (James) is a talented songwriter and singer who has collaborated with me on multiple songs including Cadillac Ivory Bone and Taylor Swift covers.',
            },
            {
                content:
                'Gay',
            }
        ],
        description:
            'Jamesteria (James) is a talented songwriter and singer who has collaborated with me on multiple songs and covers.',
    },
    {
        id: 2,
        name: 'Pavel Lipski',
        role: 'Producer, Songwriter, Musician, Mentor',
        img: "https://i.scdn.co/image/ab676161000051746ae12ca63d1d307f25d5ec97",
        detailImg: "https://i.scdn.co/image/ab676161000051746ae12ca63d1d307f25d5ec97",
        pages: [
            {
                content:
                    'Pavel is a talented orchestral producer, songwriter and musician who has mentored me in music production and audio engineering. We made a song together called Midnight.',
            },
        ],
        description:
            'Pavel is a talented orchestral producer and musician who mentored me in music production and audio engineering.',
    },
    {
        id: 3,
        name: 'Chamele Listens',
        role: 'Producer, Songwriter, Musician',
        img: "https://i.scdn.co/image/ab676161000051748ce5b1c47b72beb46f2f8126",
        detailImg: "https://i.scdn.co/image/ab676161000051748ce5b1c47b72beb46f2f8126",
        pages: [
            {
                content:
                    'Chamele Listens is a multi-genre producer with whom I have collaborated on multiple projects, including the track Bad Apple! Vocaloid Cover.',
            },
        ],
        description:
            'Chamele Listens is a multi-genre producer and songwriter I have collaborated with on various tracks.',
    },
    {
        id: 4,
        name: 'TraceCo',
        role: 'Singer',
        img: "https://i.scdn.co/image/ab67616100005174af72ed227f829a1aee837fe8",
        detailImg: "https://i.scdn.co/image/ab67616100005174af72ed227f829a1aee837fe8",
        pages: [
            {
                content:
                    'TraceCo is a wonderful singer who collaborated with me on the Interstellar Journey Rock Cover.',
            },
        ],
        description:
            'TraceCo is a wonderful singer who collaborated with me on the Interstellar Journey Rock Cover.',
    },
    {
        id: 5,
        name: 'Rueyon',
        role: 'Artist',
        img: "https://pbs.twimg.com/profile_images/1771417910076137472/vrTnEXtz_400x400.jpg",
        detailImg: "https://pbs.twimg.com/profile_images/1771417910076137472/vrTnEXtz_400x400.jpg",
        pages: [
            {
                content:
                    'Rueyon is the artist that drew almost all album covers and assisted me with songwriting, making a significant impact on our collaborations.',
            },
        ],
        description:
            'Rueyon is the artist behind most album covers and has greatly assisted in songwriting.',
    },
    {
        id: 6,
        name: 'Cypress',
        role: 'Upcoming Collaborator',
        img: "https://i.scdn.co/image/ab67616100005174f7e4d34680625e27ecba51b9",
        detailImg: "https://i.scdn.co/image/ab67616100005174f7e4d34680625e27ecba51b9",
        pages: [
            {
                content: 'Details coming soon!',
            },
        ],
        description: 'To be announced!',
    },
];

const Collaborators = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    // Set columns based on window width: 1 for mobile, 3 for larger screens.
    const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 3);

    useEffect(() => {
        const handleResize = () => {
            setColumns(window.innerWidth < 768 ? 1 : 3);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Group collaborators into rows based on the columns value.
    const rows = [];
    for (let i = 0; i < collaboratorsData.length; i += columns) {
        rows.push(collaboratorsData.slice(i, i + columns));
    }

    const handleCollabClick = (globalIndex) => {
        if (selectedIndex === globalIndex) {
            setSelectedIndex(null);
        } else {
            setSelectedIndex(globalIndex);
            setCurrentPage(0);
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        const pages = collaboratorsData[selectedIndex].pages || [];
        setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
    };

    return (
        <div className="collaborators-container">
            {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <div className="collab-grid">
                        {row.map((collab, index) => {
                            const globalIndex = rowIndex * columns + index;
                            return (
                                <div
                                    key={collab.id}
                                    className="collab-item"
                                    onClick={() => handleCollabClick(globalIndex)}
                                >
                                    <img src={collab.img} alt={collab.name} />
                                    <div className="collab-item-name">{collab.name}</div>
                                    <div className="collab-item-role">{collab.role}</div>
                                </div>
                            );
                        })}
                    </div>
                    {selectedIndex !== null &&
                        Math.floor(selectedIndex / columns) === rowIndex && (
                            <div className="collab-expanded-row">
                                <div className="collab-expanded">
                                    {columns > 1 ? (
                                        // Desktop view: arrows on the sides
                                        <>
                                            <div className="collab-nav-arrow left" onClick={handlePrev}>
                                                &#9664;
                                            </div>
                                            <img
                                                src={collaboratorsData[selectedIndex].detailImg}
                                                alt={collaboratorsData[selectedIndex].name}
                                            />
                                            <div className="collab-expanded-text">
                                                <h3>{collaboratorsData[selectedIndex].name}</h3>
                                                <p>
                                                    {collaboratorsData[selectedIndex].pages &&
                                                        collaboratorsData[selectedIndex].pages.length > 0
                                                        ? collaboratorsData[selectedIndex].pages[currentPage].content
                                                        : collaboratorsData[selectedIndex].description}
                                                </p>
                                            </div>
                                            <div className="collab-nav-arrow right" onClick={handleNext}>
                                                &#9654;
                                            </div>
                                        </>
                                    ) : (
                                        // Mobile view: arrows at the bottom
                                        <>
                                            <img
                                                src={collaboratorsData[selectedIndex].detailImg}
                                                alt={collaboratorsData[selectedIndex].name}
                                            />
                                            <div className="collab-expanded-text">
                                                <h3>{collaboratorsData[selectedIndex].name}</h3>
                                                <p>
                                                    {collaboratorsData[selectedIndex].pages &&
                                                        collaboratorsData[selectedIndex].pages.length > 0
                                                        ? collaboratorsData[selectedIndex].pages[currentPage].content
                                                        : collaboratorsData[selectedIndex].description}
                                                </p>
                                            </div>
                                            <div className="collab-nav-arrows-mobile">
                                                <div className="collab-nav-arrow" onClick={handlePrev}>
                                                    &#9664;
                                                </div>
                                                <div className="collab-nav-arrow" onClick={handleNext}>
                                                    &#9654;
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Collaborators;
