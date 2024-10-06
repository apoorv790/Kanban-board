// import React from 'react'
// import Column from '../Column/Column.jsx';
// import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// const Board = ({ data }) => {
//     const columnIcons = {
//         Todo: null,
//         'In Progress': <AlertCircle size={16} className="column-icon in-progress" />,
//         Done: <CheckCircle size={16} className="column-icon done" />,
//         Canceled: <XCircle size={16} className="column-icon canceled" />
//     };

//     return (
//         <div className="kanban-board">
//             <div className="board-header">
//                 <div className="display-dropdown">
//                     <span>Display</span>
//                     <span className="dropdown-arrow">▼</span>
//                 </div>
//                 <div className="grouping-dropdown">
//                     <span>Grouping</span>
//                     <span>Status</span>
//                     <span className="dropdown-arrow">▼</span>
//                 </div>
//                 <div className="ordering-dropdown">
//                     <span>Ordering</span>
//                     <span>Priority</span>
//                     <span className="dropdown-arrow">▼</span>
//                 </div>
//             </div>
//             <div className="board-columns">
//                 {Object.entries(data).map(([columnTitle, cards]) => (
//                     <Column
//                         key={columnTitle}
//                         title={columnTitle}
//                         cards={cards}
//                         icon={columnIcons[columnTitle]}
//                         count={cards.length}
//                     />
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Board;


import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle, XCircle, BarChart2, User, AlertTriangle } from 'lucide-react';

// KanbanCard Component
const KanbanCard = ({ id, title, status, userId, priority, tag, users }) => {
  const user = users.find(u => u.id === userId);
  const priorityIcons = {
    4: <AlertCircle size={16} className="priority-icon urgent" />,
    3: <BarChart2 size={16} className="priority-icon high" />,
    2: <BarChart2 size={16} className="priority-icon medium" />,
    1: <BarChart2 size={16} className="priority-icon low" />,
    0: null
  };

  const statusIcons = {
    'Todo': null,
    'In Progress': <AlertTriangle size={16} className="status-icon in-progress" />,
    'Done': <CheckCircle size={16} className="status-icon done" />,
    'Canceled': <XCircle size={16} className="status-icon canceled" />
  };

  return (
    <div className="kanban-card">
      <div className="card-header">
        <span className="card-id">{id}</span>
        {user && (
          <div className="avatar" title={user.name}>
            {user.name.charAt(0).toUpperCase()}
            <span className={`availability-indicator ${user.available ? 'available' : 'unavailable'}`}></span>
          </div>
        )}
      </div>
      <h3 className="card-title">{title}</h3>
      <div className="card-footer">
        {priorityIcons[priority]}
        {statusIcons[status]}
        {tag.includes("Feature request") && <span className="feature-tag">Feature Request</span>}
      </div>
    </div>
  );
};

// KanbanColumn Component
const KanbanColumn = ({ title, tickets, icon, count, users }) => {
  return (
    <div className="kanban-column">
      <div className="column-header">
        {icon}
        <h2>{title}</h2>
        <span className="card-count">{count}</span>
        <button className="add-card-btn"><Plus size={16} /></button>
      </div>
      <div className="cards-container">
        {tickets.map(ticket => (
          <KanbanCard key={ticket.id} {...ticket} users={users} />
        ))}
      </div>
    </div>
  );
};

// KanbanBoard Component
const KanbanBoard = ({ data }) => {
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('priority');
  const [groupedTickets, setGroupedTickets] = useState({});

  const priorityOrder = [4, 3, 2, 1, 0];
  const statusOrder = ['Todo', 'In Progress', 'Done', 'Canceled'];
  const priorityNames = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    const groupAndSortTickets = () => {
      let grouped = {};
      
      if (grouping === 'status') {
        grouped = data.tickets.reduce((acc, ticket) => {
          const status = ticket.status || 'No Status';
          if (!acc[status]) acc[status] = [];
          acc[status].push(ticket);
          return acc;
        }, {});
      } else if (grouping === 'user') {
        grouped = data.tickets.reduce((acc, ticket) => {
          const user = data.users.find(u => u.id === ticket.userId);
          const userName = user ? user.name : 'Unassigned';
          if (!acc[userName]) acc[userName] = [];
          acc[userName].push(ticket);
          return acc;
        }, {});
      } else if (grouping === 'priority') {
        grouped = data.tickets.reduce((acc, ticket) => {
          const priority = ticket.priority.toString();
          if (!acc[priority]) acc[priority] = [];
          acc[priority].push(ticket);
          return acc;
        }, {});
      }

      // Sort tickets within each group
      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => {
          if (sorting === 'priority') {
            return b.priority - a.priority;
          } else if (sorting === 'title') {
            return a.title.localeCompare(b.title);
          }
        });
      });

      setGroupedTickets(grouped);
    };

    if (data.tickets && data.users) {
      groupAndSortTickets();
    }
  }, [data, grouping, sorting]);

  const renderColumns = () => {
    if (grouping === 'priority') {
      return priorityOrder.map(priority => (
        <KanbanColumn
          key={priority}
          title={priorityNames[priority]}
          tickets={groupedTickets[priority] || []}
          icon={<BarChart2 size={16} className={`priority-icon priority-${priority}`} />}
          count={groupedTickets[priority]?.length || 0}
          users={data.users}
        />
      ));
    } else if (grouping === 'user') {
      return Object.keys(groupedTickets).map(userName => (
        <KanbanColumn
          key={userName}
          title={userName}
          tickets={groupedTickets[userName]}
          icon={<User size={16} />}
          count={groupedTickets[userName].length}
          users={data.users}
        />
      ));
    } else {
      return statusOrder.map(status => (
        <KanbanColumn
          key={status}
          title={status}
          tickets={groupedTickets[status] || []}
          icon={status === 'In Progress' ? <AlertTriangle size={16} /> : 
                status === 'Done' ? <CheckCircle size={16} /> : 
                status === 'Canceled' ? <XCircle size={16} /> : null}
          count={groupedTickets[status]?.length || 0}
          users={data.users}
        />
      ));
    }
  };

  return (
    <div className="kanban-board">
      <div className="board-header">
        <div className="display-dropdown">
          <span>Display</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        <div className="grouping-dropdown">
          <span>Grouping</span>
          <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="ordering-dropdown">
          <span>Ordering</span>
          <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      <div className="board-columns">
        {renderColumns()}
      </div>
      <style jsx>{`
        /* ... (previous styles) ... */
        .kanban-board {
          font-family: Arial, sans-serif;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .board-header {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .display-dropdown, .grouping-dropdown, .ordering-dropdown {
          background-color: white;
          padding: 5px 10px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .dropdown-arrow {
          font-size: 12px;
        }
        .board-columns {
          display: flex;
          gap: 20px;
        }
        .kanban-column {
          background-color: #f9fafb;
          border-radius: 8px;
          width: 280px;
          padding: 10px;
        }
        .column-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        .column-icon {
          width: 16px;
          height: 16px;
        }
        .in-progress { color: orange; }
        .done { color: green; }
        .canceled { color: gray; }
        .card-count {
          background-color: #e5e7eb;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }
        .add-card-btn {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
        }
        .cards-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kanban-card {
          background-color: white;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .card-id {
          color: #6b7280;
          font-size: 12px;
        }
        .avatar {
          width: 24px;
          height: 24px;
          background-color: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .card-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .card-footer {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ellipsis {
          color: #6b7280;
        }
        .feature-tag {
          background-color: #e5e7eb;
          color: #4b5563;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
        }
        .priority-icon, .status-icon {
          margin-right: 5px;
        }
        .priority-icon.urgent { color: #dc2626; }
        .priority-icon.high { color: #ea580c; }
        .priority-icon.medium { color: #ca8a04; }
        .priority-icon.low { color: #2563eb; }
        .status-icon.in-progress { color: #ca8a04; }
        .status-icon.done { color: #16a34a; }
        .status-icon.canceled { color: #6b7280; }
        select {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 2px 5px;
        }
        .avatar {
          position: relative;
          width: 24px;
          height: 24px;
          background-color: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .availability-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .available { background-color: #16a34a; }
        .unavailable { background-color: #dc2626; }
      `}</style>
    </div>
  );
};

export default KanbanBoard;