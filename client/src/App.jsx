import { useState, useEffect } from "react";
/*

PRAJWAL BENEDICT A
1 year ago
I am having troubles once I delete a todo, the App crashes on the API side with this error: "app crashed - waiting for file changes before starting..."  
Is there any error in the source code?

3


Reply


8 replies
wsq
wsq
11 months ago (edited)
That is because it does a double Fetch/XHR request (once for delete, and once for completed - the delete button also triggers the click for marking as complete). First it deletes then MongoDb tries to find same record to toggle the complete property value and it cannot find it because it was deleted before. I think that can be solved with Event Stop Propagation (not sure how we can do that in React) or a different button for marking as complete (not clicking the entire div),  :). Thank you for the tutorial, awesome content!

2


Reply

ADITYA PATEL
ADITYA PATEL
10 months ago
await fetch(api_base + "/todo/delete/" + id, {
      method: "DELETE",
    });



Reply

2017 88 Saif Mohammed Omer
2017 88 Saif Mohammed Omer
8 months ago
 @wsq  THANKS. It's working after making a separate button for complete.



Reply

Jade X
Jade X
8 months ago
 @2017 88 Saif Mohammed Omer  could you please share the code? I am still stuck



Reply

2017 88 Saif Mohammed Omer
2017 88 Saif Mohammed Omer
8 months ago
 @Jade X  basically I created a new div for the complete section



Reply

Tahira Ghaffar
Tahira Ghaffar
2 months ago
Make sure you're not deleteing unchecked task, that will crash website
Delete here is only working on Checked Tasks .
Also make sure the code in App.js is as follows:
const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
        method : "DELETE"
    }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }



Reply

leon alex
leon alex
1 month ago
 @Tahira Ghaffar  this doesn't work



Reply
*/
const API_BASE = "http://localhost:3001";

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    const GetTodos = () => {
        fetch(API_BASE + "/todos")
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => console.error("Error: ", err));
    };

    useEffect(() => {
        GetTodos();
    }, []);

    const completeTodo = async (id) => {
        const data = await fetch(API_BASE + "/todo/complete/" + id).then(
            (res) => res.json()
        );

        setTodos((todos) =>
            todos.map((todo) => {
                if (todo._id === data._id) {
                    todo.complete = data.complete;
                }

                return todo;
            })
        );
    };

    const deleteToDo = async (id) => {
        const data = await fetch(API_BASE + "/todo/delete/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
        setTodos((todos) =>
            todos.filter((todo) => todo._id !== data.result._id)
        );
    };

    const addTodo = async () => {
        const data = await fetch(API_BASE + "/todo/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newTodo }),
        }).then((res) => res.json());

        setTodos([...todos, data]);
        setPopupActive(false);
        setNewTodo("");
    };
    return (
        <div className="App">
            <h1>Welcome, Mobin</h1>
            <h4>Your Tasks</h4>

            <div className="todos">
                {todos.map((todo) => (
                    <div
                        className={
                            "todo " + (todo.complete ? "is-complete" : "")
                        }
                        key={todo._id}
                        onClick={() => completeTodo(todo._id)}
                    >
                        <div className="checkbox"></div>

                        <div className="text">
                            {todo.text} {todo._id}
                        </div>

                        <div
                            className="delete-todo"
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteToDo(todo._id);
                              }}
                        >
                            X
                        </div>
                    </div>
                ))}
            </div>
            <div className="addPopup" onClick={() => setPopupActive(true)}>
                +
            </div>

            {popupActive ? (
                <div className="popup">
                    <div
                        className="closePopup"
                        onClick={() => setPopupActive(false)}
                    >
                        X
                    </div>
                    <div className="content">
                        <h3>Add Task</h3>

                        <input
                            type="text"
                            className="add-todo-input"
                            onChange={(e) => setNewTodo(e.target.value)}
                            value={newTodo}
                        />
                        <div className="button" onClick={addTodo}>
                            {""}
                            Create Task{""}
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
