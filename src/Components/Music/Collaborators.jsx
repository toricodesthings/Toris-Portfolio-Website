import React, { useState } from 'react';
import './MusicMain.css';

const collaboratorsData = [
    {
        id: 1,
        name: 'Jamesteria',
        role: 'Singer, Songwriter, Artist',
        img: "https://i.scdn.co/image/ab67616100005174fd060d136f18a6037705fa48",
        detailImg: "https://i.scdn.co/image/ab67616100005174fd060d136f18a6037705fa48",
        description:
            'Jamesteria (James) is a talented songwriter and singer whom I have collaborated with produce multiple songs and covers including Cadilac Ivory Bone and Taylor Swift covers.',
    },
    {
        id: 2,
        name: 'Pavel Lipski',
        role: 'Producer, Songwriter, Musician, Mentor',
        img: "https://i.scdn.co/image/ab676161000051746ae12ca63d1d307f25d5ec97",
        detailImg: "https://i.scdn.co/image/ab676161000051746ae12ca63d1d307f25d5ec97",
        description:
            'Pavel is a talented Orchestral producer, songwriter and musician who has mentored me in the past in music production and audio engineering. Pavel and I have made a song together called Midnight.',
    },
    {
        id: 3,
        name: 'Chamele Listens',
        role: 'Producer, Songwriter, Musician',
        img: "https://i.scdn.co/image/ab676161000051748ce5b1c47b72beb46f2f8126",
        detailImg: "https://i.scdn.co/image/ab676161000051748ce5b1c47b72beb46f2f8126",
        description:
            'Chamele Listens is a multi-genre producer whom I have closely collaborated with and mentored in all things music and audio engineering. Most of his wonderful tracks are mastered by me and we have made a couple of tracks together including Bad Apple! Vocaloid Cover, and Calydon.',
    },
    {
        id: 4,
        name: 'TraceCo',
        role: 'Singer',
        img: "https://i.scdn.co/image/ab67616100005174af72ed227f829a1aee837fe8",
        detailImg: "https://i.scdn.co/image/ab67616100005174af72ed227f829a1aee837fe8",
        description:
            'TraceCo is a wonderful singer who collaborated with me on the Interstellar Journey Rock Cover',
    },
    {
        id: 5,
        name: 'Rueyon',
        role: 'Artist',
        img: "https://pbs.twimg.com/profile_images/1771417910076137472/vrTnEXtz_400x400.jpg",
        detailImg: "https://pbs.twimg.com/profile_images/1771417910076137472/vrTnEXtz_400x400.jpg",
        description:
            'Rueyon is the artist that drew almost all album covers and assisted me with songwriting, major credits to them',
    },
    {
        id: 6,
        name: 'Cypress',
        role: 'Upcoming Collaborator',
        img: "https://i.scdn.co/image/ab67616100005174f7e4d34680625e27ecba51b9",
        detailImg: "https://i.scdn.co/image/ab67616100005174f7e4d34680625e27ecba51b9",
        description:
            'To Be Announced!',
    },
];

const Collaborators = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleCollabClick = (index) => {
        // Toggle expanded section on clicking the same collaborator.
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    const handlePrev = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prevIndex) =>
            (prevIndex - 1 + collaboratorsData.length) % collaboratorsData.length
        );
    };

    const handleNext = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((prevIndex) => (prevIndex + 1) % collaboratorsData.length);
    };

    return (
        <div className="collab-grid">
            {collaboratorsData.map((collab, index) => (
                <div
                    key={collab.id}
                    className="collab-item"
                    onClick={() => handleCollabClick(index)}
                >
                    <img src={collab.img} alt={collab.name} />

                    <div className="collab-item-name">{collab.name}</div>
                    <div className="collab-item-role">{collab.role}</div>
                </div>
            ))}

            {selectedIndex !== null && (
                <div className="collab-expanded" style={{ gridColumn: '1 / -1' }}>
                    <div className="collab-nav-arrow left" onClick={handlePrev}>
                        &#9664;
                    </div>
                    <img
                        src={collaboratorsData[selectedIndex].detailImg}
                        alt={collaboratorsData[selectedIndex].name}
                    />
                    <div className="collab-expanded-text">
                        <h3>{collaboratorsData[selectedIndex].name}</h3>
                        <p>{collaboratorsData[selectedIndex].description}</p>
                    </div>
                    <div className="collab-nav-arrow right" onClick={handleNext}>
                        &#9654;
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collaborators;
