import React, { useEffect, useState } from 'react';
import { useTodos } from '../../Contexts/ContextTodo/ContextTodo';
import ItemTodo from '../ItemTodo/ItemTodo';

const ListTodo = () => {
    // cần todo, 1 state lấy giá trị của all, pending, ...; 1 hàm kiểm tra trạng thái comp, pend,exp
    const {handleActions, nameActionIShow, todos, isToggleTask, visibleModal, editTask, arrayForRender, setArrayForRender} = useTodos();
    const [componentModal, setComponentModal] = useState(null);
    useEffect(()=>{
        setArrayForRender(handleActions(nameActionIShow));

    }, [nameActionIShow, todos.length, isToggleTask, editTask])
    return (
        <div className='px-5 max-h-[290px] overflow-y-scroll relative scroll-style-id3'>
            {
                arrayForRender.length > 0 && arrayForRender.map((item)=>{
                    return <ItemTodo key={item.id} todo={item} setArrayForRender={setArrayForRender}
                    modal={{componentModal, setComponentModal}}
                    ></ItemTodo>
                })
            }
            {visibleModal && (componentModal)}
        </div>

    );

};

export default ListTodo;