import { createContext, useContext, useEffect, useReducer, useState } from "react";
import useLocalStorage from "../../Hooks/useLocalStorage/useLocalStorage";
const CONTEXT_TODO = createContext();

/* const initialValue = []; */

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";
const EDIT_TODO = "EDIT_TODO";
const UPDATE_STATUS_TODOS = "UPDATE_STATUS_TODO"
const TOGGLE_STATUS = "TOGGLE_STATUS"
/* const SHOW_ACTIONS = {
    ALL : "ALL_IN_SHOW",
    PENDING : "PENDING_IN_SHOW",
    COMPLETED : "COMPLETED_IN_SHOW",
    EXPIRED: "EXPIRED_IN_SHOW"
} */
const SHOW_ACTIONS = [
    {name: "All", value: "ALL_IN_SHOW"},
    {name: "Pending", value: "PENDING_IN_SHOW"},
    {name: "Completed", value: "COMPLETED_IN_SHOW"},
    {name: "Expired", value: "EXPIRED_IN_SHOW"}
    
]
const SORT_ACTIONS = [
    {
        name: "Time", value: "TIME_IN_SORT"
    },
    {   
        name: "A -> Z", value: "ASCENDING_SORT"
    },
    {
        name: "Z -> A", value: "DESCENDING_SORT"
    }
]
const Reducer = (state, payload)=>{
    switch(payload?.type){
        case ADD_TODO: {
          
            return [...state, payload.value];
        }
        case UPDATE_STATUS_TODOS: {
            
            return [...payload.value];
        }
        case DELETE_TODO: {
            const newArr = state.filter(item=>{
                return item.id !== payload.id;
            })
          
            return newArr;
            
        }
        case TOGGLE_STATUS: {
           
            const newArr = state.filter((item)=>{
                return item.id !== payload.id;
            })
    
            return [...newArr, payload.value];
        }
        default: {
            console.log("Don't know this actions");
            break;
        }
    }
    return state;
}

function isExpired(todo){
    // todo : {date: "Monday 01/08/2022", time: "16:07" ,title: "123"}
    return new Date(`${todo.date.split(/\s/)[1].split(/\//).reverse().join("-")}T${todo.time}`) <= new Date();
}

function TodoProvider(props){
    const [storedValue, setValueStored] = useLocalStorage("TODOS_REACT", []);
    const [todos, dispatch] = useReducer(Reducer, storedValue);
    const [nameActionIShow, setNameActionShow] = useState(SHOW_ACTIONS[0].value);
    const [isToggleTask, setToggleTask] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [arrayForRender, setArrayForRender] = useState([])
    // trả về 1 mảng đã thay đổi status khi so sánh với thời gian hiện tại lúc hàm thực thi
    function handleUpdateStatusOfItem(){
        const newArr = todos.map((todo)=>{
            /* nếu status là completed và ngày trước ngày hiện tại thì vẫn dữ nguyên là completed (xảy ra khi gọi toggleStatus
                lúc toggle về pending thì sẽ render lại và nhảy sang expired)
            */
            if (isExpired(todo) && todo.status === "completed"){
                return {...todo}
            }
            // if this task has been expired
            if (isExpired(todo) && todo.status === "pending") 
            {
                return {...todo, status : "expired"} 
            }
            {
                return {...todo}
            }
        })
        return newArr;
    }

    function handleActions(actionKey, keySearch){
      
        switch (actionKey){
            case "ALL_IN_SHOW": {
                const newArr = handleUpdateStatusOfItem();

                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});

                const arrRender = newArr.map((item)=>{
                    return {...item, isShow: true};
                })
              
                return arrRender;
            }
            case "PENDING_IN_SHOW": {
                
                const newArr = handleUpdateStatusOfItem();

                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});

                const arrRender = newArr.map((item)=>{
                    return (item.status === "pending") ? {...item, isShow: true} : {...item, isShow: false}
                })
              
                return arrRender;
            }
            case "COMPLETED_IN_SHOW":{
                const newArr = handleUpdateStatusOfItem();

                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});

                const arrRender = newArr.map((item)=>{
                    return (item.status === "completed") ? {...item, isShow: true} : {...item, isShow: false}
                })
              
                return arrRender;
            }
            case "EXPIRED_IN_SHOW":{
                const newArr = handleUpdateStatusOfItem();

                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});

                const arrRender = newArr.map((item)=>{
                    return (item.status === "expired") ? {...item, isShow: true} : {...item, isShow: false}
                })
              
                return arrRender;
            }
            case "TIME_IN_SORT":{
                const newArr = handleUpdateStatusOfItem();
                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});

                let deepCopy = [...newArr];

                deepCopy.sort(function (a, b){
                    return new Date(`${a.date.split(/\s/)[1].split(/\//).reverse().join("-")}T${a.time}`) 
                    - new Date(`${b.date.split(/\s/)[1].split(/\//).reverse().join("-")}T${b.time}`) 
                })
                deepCopy = deepCopy.map((item)=>{
                    return {...item, isShow: true}
                })
                return deepCopy;
            }
            case "ASCENDING_SORT":{
                const newArr = handleUpdateStatusOfItem();
                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});
                let deepCopy = [...newArr];

                deepCopy.sort((a, b)=>{
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                })
                deepCopy = deepCopy.map((item)=>{
                    return {...item, isShow: true}
                })
                return deepCopy;
            }
            case "DESCENDING_SORT":{
                const newArr = handleUpdateStatusOfItem();
                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});
                let deepCopy = [...newArr];

                deepCopy.sort((a, b)=>{
                    return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
                })
                deepCopy = deepCopy.map((item)=>{
                    return {...item, isShow: true}
                })
                return deepCopy;
            }
            case "ANOTHER": {
                const newArr = handleUpdateStatusOfItem();
                dispatch({ type: UPDATE_STATUS_TODOS, value: newArr});
                // Đưa các todo về lại là (show ) hiện ra trên list!
                
                let arrRender = newArr.map((item)=>{
                    return {...item, isShow: true};
                })
                if (!keySearch){
                    return arrRender; 
                    
                }

                arrRender = arrRender.filter((item)=>{
                    return item.title.includes(keySearch);
                })

                return arrRender;
            }
            default: {
                console.log("this is default case in handleActions function");
                break;
            }
        }
        return todos;
    }
    useEffect(()=>{
        setValueStored(todos);
    }, [todos])
    const value = {todos, dispatch, ADD_TODO, nameActionIShow, setNameActionShow, visibleModal, setVisibleModal, isEdit, setEdit
        , SHOW_ACTIONS, SORT_ACTIONS, handleActions, TOGGLE_STATUS, isToggleTask, setToggleTask, DELETE_TODO, editTask, setEditTask,
        arrayForRender, setArrayForRender, isExpired
    };

    return (
        
        <CONTEXT_TODO.Provider value={value} {...props}></CONTEXT_TODO.Provider>
    )
}
function useTodos(){
    const todoData = useContext(CONTEXT_TODO);
    if (todoData === undefined) {throw new Error("todoData must be within a CONTEXT_TODO")};
    return todoData;
}
export {TodoProvider, useTodos};