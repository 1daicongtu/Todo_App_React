import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../../Contexts/ContextTodo/ContextTodo';
import _debounce from 'lodash/debounce';
import styles from "./TodoControls.module.css"
const CONTROL_ACTIONS = {
    SHOW_CONTROL : "SHOW",
    SORT_CONTROL : "SORT",
    SEARCH_CONTROL : "SEARCH"
}






const TodoControls = () => {
    const {nameActionIShow, setNameActionShow, SHOW_ACTIONS, SORT_ACTIONS, handleActions, setArrayForRender} = useTodos();
    const [nameControl, setNameControl] = useState(CONTROL_ACTIONS.SHOW_CONTROL);
    
    const refActived = useRef();
    const refLine = useRef();

    function handleSetActiveControls(name, action){
        setNameControl(name);
        setNameActionShow(action)
    }

    useEffect(()=>{

        refLine.current.style.width = `${refActived.current.offsetWidth}px`;
        refLine.current.style.left = `${refActived.current.offsetLeft}px`

    }, [nameControl])
    

   /*  const handleSearchQuery = lodash.debounce(function (e){
        console.log(e);
        /* handleActions("ANOTHER", e.target.value.trim()); 
    }, 3000) */
    const handleSearchQuery = _debounce((e)=>{
        
        setArrayForRender(handleActions("ANOTHER", e.target.value.trim()));
    }, 400);
    return (
        <div className=''>
            <div className='relative flex justify-between px-5 font-bold text-slate-400'>
                <p 
                    ref={(nameControl === CONTROL_ACTIONS.SHOW_CONTROL) ? refActived : undefined}
                    className={`${nameControl === CONTROL_ACTIONS.SHOW_CONTROL ? styles.activedControls: ""} uppercase text-center flex-1 cursor-pointer hover:text-[#6200ee] py-2`}
                    onClick={()=>{handleSetActiveControls(CONTROL_ACTIONS.SHOW_CONTROL, SHOW_ACTIONS[0].value)}}
                >Show</p>

                <p className={`${nameControl === CONTROL_ACTIONS.SORT_CONTROL ? styles.activedControls: ""} uppercase text-center flex-1 cursor-pointer hover:text-[#6200ee] py-2`}
                    ref={(nameControl === CONTROL_ACTIONS.SORT_CONTROL) ? refActived : undefined}
                    onClick={()=>handleSetActiveControls(CONTROL_ACTIONS.SORT_CONTROL, SORT_ACTIONS[0].value)}
                >Sort</p>

                <p 
                    className={`${nameControl === CONTROL_ACTIONS.SEARCH_CONTROL ? styles.activedControls: ""} uppercase text-center flex-1 cursor-pointer hover:text-[#6200ee] py-2`}
                    ref={(nameControl === CONTROL_ACTIONS.SEARCH_CONTROL) ? refActived : undefined}
                    onClick={()=>handleSetActiveControls(CONTROL_ACTIONS.SEARCH_CONTROL, "ANOTHER")}
                >Search</p>
                <div 
                    className={styles.lineControls} 
                    ref={refLine}
                  /*  style={refActived.current ? {left: refActived.current.offsetLeft, width: refActived.current.offsetWidth} : {}}*/
                ></div>
            </div>

            <div className="h-full min-h-[50px] max-h-[50px] border-y border-gray-700 mt-[2px]">
                {
                    nameControl === CONTROL_ACTIONS.SHOW_CONTROL && (
                        <div className='relative flex items-center justify-between font-semibold translate-y-1/2 top-1/2'>
                            {
                                SHOW_ACTIONS.map((actions, index)=>{
                                    return (
                                        <p 
                                            key={index}
                                            className={`${actions.value === nameActionIShow ? styles.activedShowControls : ""} flex-1 text-center cursor-pointer`}
                                            onClick={()=>{setNameActionShow(actions.value)}}
                                        >
                                            <span className='text-black'>{actions.name}</span>
                                        </p>
                                    )
                                })
                            }
                           {/*  <p className={`${SHOW_ACTIONS.ALL === nameActionIShow ? styles.activedShowControls : ""} flex-1 text-center cursor-pointer`}><span className='text-black'>All</span></p>
                            <p className={`${SHOW_ACTIONS.PENDING === nameActionIShow ? styles.activedShowControls : ""} flex-1 text-center cursor-pointer`}><span className='text-black'>Pending</span></p>
                            <p className={`${SHOW_ACTIONS.COMPLETED === nameActionIShow ? styles.activedShowControls : ""} flex-1 text-center cursor-pointer`}><span className='text-black'>Completed</span></p>
                            <p className={`${SHOW_ACTIONS.EXPIRED === nameActionIShow ? styles.activedShowControls : ""} flex-1 text-center cursor-pointer`}><span className='text-black'>Expired</span></p> */}
                        </div>
                    )
                }
                {
                    nameControl === CONTROL_ACTIONS.SORT_CONTROL && (
                        <div className='relative flex items-center justify-between font-semibold translate-y-1/2 top-1/2'>
                            {
                                SORT_ACTIONS.map((action, index)=>{
                                    return (
                                        <p 
                                            key={index} 
                                            className={` ${action.value === nameActionIShow ? styles.activedShowControls : ""} text-center flex-1 cursor-pointer`}
                                            onClick={()=>setNameActionShow(action.value)}
                                        >  <span className='text-black'>{action.name}</span></p>
                                    )
                                })
                            }
                            {/* <p className={`text-center flex-1 cursor-pointer`}>Time</p>
                            <p className={`text-center flex-1 cursor-pointer`}>A -> Z</p>
                            <p className={`text-center flex-1 cursor-pointer`}>Z -> A</p> */}
                        </div>
                    ) 
                }
                {
                    nameControl === CONTROL_ACTIONS.SEARCH_CONTROL && (
                        <div className='flex items-center min-h-[50px] max-w-full'>
                            <div className='relative flex items-center flex-1 mx-5 overflow-hidden border border-gray-500 rounded-md'>
                            
                                <input 
                                    className='w-full py-1.5 px-8 border-none outline-none'
                                    placeholder='What task are you looking for?'
                                    name="search-todo"
                                    onChange={handleSearchQuery}
                                ></input>
                                <i className="absolute px-2 fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                    )
                }
            </div>
            
        </div>
    );
};

export default TodoControls;