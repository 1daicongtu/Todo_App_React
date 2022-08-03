import React, { useEffect, useRef, useState } from 'react';
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import styles from "./InputTodo.module.css"
import { useTodos } from '../../Contexts/ContextTodo/ContextTodo';
import useLocalStorage from '../../Hooks/useLocalStorage/useLocalStorage';

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const validateSchema = yup.object({
    title: yup.string().required("Không được để trống!"), 
    timetodo: yup.string().required("Bạn phải chọn ngày và giờ!") 
})


const InputTodo = () => {
    const [idTodoStorage, setIDTodoStorage] = useLocalStorage("ID_TODO_REACT", 1);
    const {todos, dispatch, ADD_TODO, isEdit, setEdit, editTask, setEditTask, DELETE_TODO} = useTodos();
    const {register, handleSubmit, getValues ,formState: {errors, isValid} ,reset, watch, setFocus, setValue, control} = useForm(
        {
            mode: "onChange",
            resolver: yupResolver(validateSchema),
        }
    );
    const [stateErrorDate, setStateErrorDate] = useState("");
    const [printDate, setPrintDate] = useState(undefined)
    const [stateID, setStateID] = useState(idTodoStorage);
    const fnSubmitFormTodo = (values)=>{

        if (!validatorCustomDate(values.timetodo) && !editTask){
            return;
        }
        /* {title: '123', timetodo: '2022-08-03T20:02'} */

       /*  if (!isValid){
            return;
        } */
        if (editTask){
            dispatch({type: DELETE_TODO, id: editTask.id});
            setStateErrorDate("");
        }
        const [dateTemp, time] = values.timetodo.split("T");
        const valuesFinally = {
            title: values.title,
            date: weekday[new Date(dateTemp).getDay()] + " " + dateTemp.split("-").reverse().join("/"),
            time,
            status: editTask ? editTask.status : "pending",
            id: stateID,
        }
        setEditTask(null);
        setStateID(prev => prev + 1);
        return new Promise(resolve=>{
            setPrintDate(null);
            setFocus("title")
            resolve();
            dispatch({type: ADD_TODO, value: valuesFinally})
            reset({
                title: "",
                timetodo: ""
            })
    
           
        })  
        
    }
    /* if (isEdit){
        console.log("EDIT TASK", editTask);
        setEdit(false);
    
    }  */
    useEffect(()=>{
        if (!isEdit){
            return;
        }
        setFocus("title");
        setValue("title", editTask.title);
        setValue("timetodo", `${editTask.date.split(/\s/)[1].split(/\//).reverse().join("-")}T${editTask.time}`);
        setPrintDate(`${editTask.date.split(/\s/).join(" | ")} | ${editTask.time}`)

        setEdit(false);

    }, [isEdit])

    useEffect(()=>{
        setIDTodoStorage(stateID);
    }, [stateID])
    function handlePrintDate(e){
        const [date, time] = e.target.value.split("T");
        setPrintDate(`${weekday[new Date(date).getDay()]} | ${date.split("-").reverse().join("/")} | ${time}`)
        if (!validatorCustomDate(e.target.value)){
            //setPrintDate(null);
           
            return;
        }
        setStateErrorDate("");
        //const [date, time] = e.target.value.split("T");
        
        //setPrintDate(`${weekday[new Date(date).getDay()]} | ${date.split("-").reverse().join("/")} | ${time}`)
    }
        
    function validatorCustomDate(dateString){
        if (errors.timetodo) 
        {errors.timetodo.message = ""};
        
        if ((new Date(dateString) <= new Date())){
            console.log(dateString);
            setStateErrorDate("Phải lớn hơn ngày, giờ hiện tại");
            return false;
        }
       
        return true;
    }
    return (
        <div className='px-5 py-4'>
            <h1 className='text-4xl font-bold app__name mb-7'>To Do List</h1>
            <form action='#' onSubmit={handleSubmit(fnSubmitFormTodo)}>
                <div>
                    <div className='relative'>
                        <input {...register("title")}
                            name="title" 
                            id="title"
                          
                            className="w-full p-3 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
                        />
                        <label htmlFor='title' className={`${watch("title") ? "top-0  -translate-y-1/2 bg-white" : "top-1/4"} absolute left-0 ml-4 text-lg font-bold text-slate-400`} style={{transition: "0.2s"}}>Task name</label>
                    </div>
                    {errors.title && 
                    (
                        <span className='mr-auto text-sm italic font-bold text-left text-red-600'>{errors.title.message}</span>
                    )}
                   
                </div>
                <div className='flex flex-wrap items-center justify-between mt-5'>
                    <p className='font-bold'>Due date:</p>
                    <label  className='font-bold'>{printDate  ? printDate : "---dd/mm/yyyy --:--"}</label>
                    <div className='relative'>
                        
                        <input
                            name='timetodo' 
                            {...register("timetodo")}
                            
                            id="timetodo" 
                            type="datetime-local" 
                            className='w-[32px] text-3xl absolute top-0 left-0 z-10 opacity-0 cursor-pointer'
                            onChange={handlePrintDate}
                        ></input>
                        <i className="text-3xl transition-all cursor-pointer fa-solid fa-calendar-check hover:text-blue-500"></i>
                       
                    </div>
                   <div className='w-full'>
                        {errors.timetodo && <span className='mr-auto text-sm italic font-bold text-left text-red-600'>{errors.timetodo.message}</span>}
                        {stateErrorDate && 
                        (
                            <span className='mr-auto text-sm italic font-bold text-left text-red-600'>{stateErrorDate}</span>
                        )}
                  </div>
                </div>
                <button type='submit' className='w-full p-3 mt-5 text-lg font-bold text-white bg-blue-500 rounded-md'>{editTask ? "Save Task" : "Add Task"}</button>
            </form>
        </div>
    );
};

export default InputTodo;