import React from 'react';
import InputTodo from '../InputTodo/InputTodo';
import TodoControls from '../TodoControls/TodoControls';
import ListTodo from '../ListTodo/ListTodo';

const TodosApp = () => {
    return (
        <div className='rounded-lg w-full max-w-[420px] mx-auto md:bg-white lg:bg-white sm:bg-white py-5'>
            <InputTodo></InputTodo>
            <TodoControls></TodoControls>
            <ListTodo></ListTodo>
        </div>
    );
};

export default TodosApp;