import React, { useState } from 'react';
import './MusicMain.css';
import placeholderImg from "../../assets/artwork_me.png";

const collaboratorsData = [
    {
        id: 1,
        name: 'Jamesteria',
        role: 'Singer, Songwriter, Artist',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Alice is a talented singer who has collaborated on many projects and brings emotion to every performance.',
    },
    {
        id: 2,
        name: 'Pavel Lipski',
        role: 'Producer, Songwriter, Musician, Mentor',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Bob is an innovative artist who creates visual masterpieces for our music videos and album covers.',
    },
    {
        id: 3,
        name: 'Chamele Listens',
        role: 'Producer, Songwriter, Musician',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Carol is an expert producer with a keen ear for sound, ensuring every track is mixed to perfection.',
    },
    {
        id: 4,
        name: 'TraceCo',
        role: 'Singer',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Dave composes captivating scores that perfectly complement our musical storytelling.',
    },
    {
        id: 5,
        name: 'Rueyon',
        role: 'Artist',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Eve is a dynamic DJ known for electrifying live performances and unique remix skills.',
    },
    {
        id: 6,
        name: 'Cypress',
        role: 'Upcoming Collaborator',
        img: placeholderImg,
        detailImg: placeholderImg,
        description:
            'Eve is a dynamic DJ known for electrifying live performances and unique remix skills.',
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
