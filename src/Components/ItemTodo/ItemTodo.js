import React, { useRef, useState } from 'react';
import { useTodos } from '../../Contexts/ContextTodo/ContextTodo';
import ModalBase from '../ModalBase/ModalBase';
import styles from "./ItemTodo.css"


const ItemTodo = ({todo, setArrayForRender, modal: {componentModal, setComponentModal}}) => {

    const {todos, dispatch, TOGGLE_STATUS, handleActions, visibleModal, setVisibleModal, isEdit, setEdit, setEditTask
        , nameActionIShow, isToggleTask, setToggleTask, DELETE_TODO, isExpired} = useTodos();

    const refIconEdit = useRef();
    

    function toggleStatus(event, todo){
        if (event.target === refIconEdit.current){
            return;
        }
        // Nếu status là expired thì ko đc phép thay đổi sang pending, completed
        if ((todo.status === "expired") || (isExpired(todo) && todo.status === "completed")){
            return;
        }
        const newStatus = (todo.status === "pending") ? "completed" : "pending";
        // loaị bỏ thược tính isShow khỏi Object
        const {isShow, ...rest} = todo
        dispatch({type: TOGGLE_STATUS, value: {...rest, status: newStatus}, id: todo.id});
        setToggleTask(!isToggleTask);
    }
    function HandleEditTask(e, todo){
        e.stopPropagation()
        var rect = e.target.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        setVisibleModal(true);
        return (<ModalBase visible={true} onClose={()=>{setVisibleModal(false)} }
            bodyStyles={{top, left, width: 120, height: 90}} bodyClassName={"shadow bg-white"}>
                <div className='p-3'>
                    <div className='px-2 py-1 items-center flex justify-between cursor-pointer hover:bg-red-600 hover:text-white transition-all'
                        onClick={()=>{dispatch({type: DELETE_TODO, id: todo.id}); setVisibleModal(false)}}
                    >
                        <i className="fa-regular fa-trash-can"></i>
                        DELETE
                    </div>
                    {(todo.status !== "expired") && (
                        <div className='px-2 py-1 items-center flex justify-between cursor-pointer hover:bg-red-600 hover:text-white transition-all'
                            onClick={()=>{handleEditTaskTodo(todo)}}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            EDIT
                        </div>
                    )}
                </div>
        </ModalBase>)
    }
    function handleEditTaskTodo(todo){
        setEdit(true);
        setEditTask(todo);
        setVisibleModal(false);
    }
    return (
        <>
            <div 
                className={`${todo.status} ${todo.isShow ? "show" : "hide"} flex items-center justify-between py-3 border-b border-gray-400 cursor-pointer`}
                onClick={(e)=>{toggleStatus(e, todo)}}
            >
                <div className='flex items-center'>
                    <i className={`statusIcon pr-4 text-2xl fa-solid fa-square-check`}
                        
                    ></i>
                    <div>
                        <span className='text-sm italic font-thin'>{todo.date}</span>
                        <p className={`statusTitle text-lg font-bold text-left`}
                        >{todo.title}</p>
                    </div>
                </div>
                <div className='flex'>
                    <span className='text-sm italic font-thin'>{todo.time}</span>
                    <i className=" fa-solid fa-pencil text-lg cursor-pointer hover:text-green-500 p-2 transition-all pr-0"
                        ref={refIconEdit}
                        onClick={(e)=>{setComponentModal(HandleEditTask(e, todo))}}
                        
                    >
                    </i>
                    
                </div>
                
            </div>   
          
        </>
    );
};

export default ItemTodo;