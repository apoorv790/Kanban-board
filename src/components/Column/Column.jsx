import React from 'react'
// import KanbanTaskCard from '../Task/Task.jsx'
import { Plus } from 'lucide-react';



const Column = ({ title, tickets=[], icon, count, users }) => {
    return (
        <>
            <div className="kanban-column">
                <div className="column-header">
                    {icon}
                    <h2>{title}</h2>
                    <span className="card-count">{count}</span>
                    <button className="add-card-btn"><Plus size={16} /></button>
                </div>
                <div className="cards-container">
                    {tickets.map(ticket => (
                        <KanbanTaskCard key={ticket.id} {...ticket} users={users} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Column