
import './App.css';
import TodosApp from './Components/TodosApp/TodosApp';
import { TodoProvider } from './Contexts/ContextTodo/ContextTodo';

function App() {

  return (
    <div className="App lg:bg-blue-600 md:bg-white sm:bg-white" style={{height: "100vh", maxHeight: "100vh"}}>
      <TodoProvider>
        <TodosApp></TodosApp>
      </TodoProvider>
    </div>
  );
}

export default App;
