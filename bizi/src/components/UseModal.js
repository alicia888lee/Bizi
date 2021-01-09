import { useState } from 'react';

const UseModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    function toggleModal() {
        setIsVisible(!isVisible);
    }

    return {
        isVisible,
        toggleModal
    }
};

export default UseModal;