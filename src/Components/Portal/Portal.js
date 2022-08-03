import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';


function createPortalWrapper(){
    const element = document.createElement("div");
    element.id = "portal-wrapper";
    return element;
}

const portalWrapperElem = createPortalWrapper();


const Portal = ({containerClassName = "", bodyClassName = "", onClose = () => {}
, containerStyle = {}, bodyStyles= {}, children}) => {
    
    useEffect(()=>{
        document.body.appendChild(portalWrapperElem);
    }, [])

    const renderContent = 
    (
        <div
            className={`fixed inset-0 z-[9999] ${containerClassName}`}
            style={containerStyle}
        >
            <div className='absolute inset-0 overlay' onClick={onClose}></div>
            <div className={`absolute z-10 content ${bodyClassName} transition-all`}
                style={bodyStyles}
            >
                {children}
            </div>
        </div>
    )

    return createPortal(renderContent,  portalWrapperElem );
};

Portal.propTypes = {
    containerClassName: PropTypes.string,
    bodyClassName: PropTypes.string,
    containerStyle: PropTypes.object,
    bodyStyles: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node
    
}

export default Portal;