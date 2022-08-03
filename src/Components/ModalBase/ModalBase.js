import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Portal from '../Portal/Portal';

const ModalBase = ({visible, onClose, children, ...props}) => {
    return (
        <>
            <CSSTransition
                in={visible} timeout={350} unmountOnExit  classNames="zoom"
            >
                {
                    (status) => (
                        <Portal onClose={onClose} visible={status !== "exited"} 
                            {...props}
                            containerClassName="flex items-center justify-center"
                        >{children}</Portal>
                    )
                }
               
            </CSSTransition>
        </>
    );
};

export default ModalBase;

