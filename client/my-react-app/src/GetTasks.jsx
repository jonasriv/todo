import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const GetTasks = () => {
    const [data, setData] = useState([]);
    const [visibleTasks, setVisibleTasks] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [currentTaskType, setCurrentTaskType] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => { //UseEffect is used to make the fetch only run once. The empty [] at the end makes it run only once. 
        console.log("GetTasks component mounted");
        fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }) //fetching data from the API endpoint (server.js sends tasks.json)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data);
            })
            .catch(error => console.log(`Error fetching tasks: ${error}`));
    }, [token]);

    const handleDelete = (taskType, taskName) => {
        fetch(`/api/tasks/${taskType}/${taskName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.ok){
                //if the delete was successful, update the state to reflect the changes
                setData(prevData => 
                    prevData.map(item => item.taskType === taskType? {...item, tasks: item.tasks.filter(task => task.name !== taskName)}
                        :item
                    )
                );
            } else {
                console.error('Failed to delete task');
            }
        })
        .catch(error => console.error('Error deleting task', error));
    };


    const handleCheck = (taskType, taskName) => {
        console.log(taskType, taskName);
        fetch(`/api/tasks/${taskType}/${taskName}`, {
            method: 'PATCH', //Use PATCH  for small updates. 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({completed: true}),
        })
        .then(response => {
            if(response.ok){
                console.log("Task updated successfully");
            } else {
                console.error("Failed to update task");
            }
        })
        .then(() => {
            setData(prevData => 
                prevData.map(taskTypeItem => 
                    taskTypeItem.taskType === taskType 
                    ? {
                        ...taskTypeItem, 
                        tasks: taskTypeItem.tasks.map(task => 
                            task.name === taskName ? { ...task, completed: !task.completed } : task
                            )
                        }
                        : taskTypeItem
                    )
                )
        })
        .catch(error => console.error("Error: ", error));
    };
    
    const handleAddTask = (taskType) => {
        setVisibleTasks(prevState => ({
            ...prevState,
            [taskType]: !prevState[taskType]
        }));
        setCurrentTaskType(taskType);
    };

    
    const handleSubmit = (taskType) => {
        if(currentTaskType) {
            addNewTask(taskType, newTask);
            setNewTask('');
            setVisibleTasks(prevState => ({
                ...prevState,
                [currentTaskType]: false
            }));        
            setCurrentTaskType(null);
        }
    };

    const addNewTask = (taskType, newTask) => {
        //alert(`Task type: ${taskType}, New Task: ${newTask}`);
        fetch(`/api/tasks/${taskType}/${newTask}`, {
            method: 'PUT', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newTask }),
        })
        .then(response => {
            if (response.ok){
                console.log('Task added successfully');
            } else {
                console.error('Failed to add task');
            }
        })
        .then(() => {
            setData(prevData => 
                prevData.map(taskTypeItem => 
                    taskTypeItem.taskType === taskType 
                    ? {
                        ...taskTypeItem, 
                        tasks: [
                            ...taskTypeItem.tasks,
                            { name: newTask, completed: false }
                        ]
                    }   
                    : taskTypeItem
                )   
            );
        })        
        .catch(error => console.error('Error adding task:', error)); 
    };
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return(
            <div className='tasks-div'>
                {data.length === 0 ? (
                    <div>
                        <p> No tasks available. </p>
                        <p> Add a new task to get started. </p>
                    </div>
                ) : (
                data.map((taskRange, index) => (
                    <div key={index} id='task-box'>
                        <h2>...{taskRange.taskType.toLowerCase()}</h2>
                        <ul>
                                {taskRange.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex}>
                                        <div>{task.name}</div>
                                        <div>
                                            <input 
                                                type='checkbox' 
                                                checked={task.completed} 
                                                onChange={() => 
                                                    {
                                                        handleCheck(taskRange.taskType, task.name)
                                                    }}>
                                            </input>
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => 
                                                    {
                                                        handleDelete(taskRange.taskType, task.name)
                                                    }} 
                                                className='delete-button'>
                                                    <img src='/delete.svg'></img>
                                            </button>
                                        </div>  
                                    </li>
                                ))}
                            
                        </ul>
                        <button 
                            onClick={() => 
                                handleAddTask(taskRange.taskType)}
                            className='add-button' 
                            style={{ display: visibleTasks[taskRange.taskType] ? 'none' : 'block'}}
                            >
                                <img src='/add_task.svg'/>
                        </button>
                        {visibleTasks[taskRange.taskType] && (
                            <div className="new-task-div" id={`new-task-div-${taskRange.taskType}`}>
                                <input 
                                    type="text" 
                                    className="new-task" 
                                    placeholder="Nytt gjeremål..." 
                                    value={newTask} 
                                    onChange={(e) => 
                                        setNewTask(e.target.value)
                                        }>
                                </input>
                                <button 
                                    className="submit-button" 
                                    onClick={() => handleSubmit(taskRange.taskType)}
                                    >
                                        <img src='/add_task.svg'></img>
                                </button>
                                <button 
                                    className="back-button" 
                                    onClick={() => 
                                        handleAddTask(taskRange.taskType, newTask)
                                        }
                                    >
                                    <img src='/up.svg'></img>
                                </button>
                            </div>
                        )}
 

                    </div>
                )))}
                <div className="logout-div">
                    <button className="login-button" onClick={handleLogout}>Logg ut</button>
                </div>
            </div>
                       
    );
};

export default GetTasks
