import { useState, useRef, useEffect } from 'react';

function useOnClickOutside(ref, handler) {
    const listener = (e) => {
        if (!ref.current || ref.current.contains(e.target)) {
            return;
        }
        handler(e);
    };
    useEffect(() => {
        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, []);
}

const UseModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef()
    function toggleModal() {
        setIsVisible(!isVisible);
    }
    useOnClickOutside(ref, () => setIsVisible(false))

    return {
        isVisible,
        toggleModal,
        ref
    }
};

export default UseModal;