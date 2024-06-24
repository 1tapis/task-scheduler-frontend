import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('https://task-scheduler-backend-3zcn.onrender.com/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (editing) {
            try {
                await axios.put(`https://task-scheduler-backend-3zcn.onrender.com/tasks/${currentTask.id}`, { title, description });
                setEditing(false);
                setCurrentTask(null);
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            try {
                await axios.post('https://task-scheduler-backend-3zcn.onrender.com/tasks', { title, description });
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
        setTitle('');
        setDescription('');
        fetchTasks();
    };

    const editTask = (task) => {
        setEditing(true);
        setCurrentTask(task);
        setTitle(task.title);
        setDescription(task.description);
    };

    const removeTask = async (id) => {
        try {
            await axios.delete(`https://task-scheduler-backend-3zcn.onrender.com/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    return (
        <div className="App">
            <h1>Task Scheduler</h1>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">{editing ? 'Update Task' : 'Add Task'}</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title} - {task.description}
                        <button onClick={() => editTask(task)}>Edit</button>
                        <button onClick={() => removeTask(task.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
