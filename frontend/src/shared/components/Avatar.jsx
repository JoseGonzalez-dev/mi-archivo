import React from 'react';

const getColorFromString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const valuePart = (hash >> (i * 8)) & 0xff;
        color += `00${valuePart.toString(16)}`.slice(-2);
    }

    return color;
};

export const GenerateInitialsAvatar = ({ name, surname }) => {
    if (!name) return null;

    const nameInitial = name.charAt(0).toUpperCase();
    const surnameInitial = surname ? surname.charAt(0).toUpperCase() : '';
    const backgroundColor = getColorFromString(`${name}${surname || ''}`);

    return (
        <div
            className="avatar-small"
            style={{ backgroundColor }}
        >
            <span>
                {nameInitial}
                {surnameInitial}
            </span>
        </div>
    );
};

export const GenerateInitialsAvatarProfile = ({ name, surname }) => {
    if (!name) return null;

    const nameInitial = name.charAt(0).toUpperCase();
    const surnameInitial = surname ? surname.charAt(0).toUpperCase() : '';

    const backgroundColor = getRandomColor();

    return (
        <div
            className="avatar-large"
            style={{ backgroundColor }}
        >
            <span>
                {nameInitial}
                {surnameInitial}
            </span>
        </div>
    )
}
