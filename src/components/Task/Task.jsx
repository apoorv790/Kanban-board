import React from 'react';
import { AlertTriangle , BarChart2, CheckCircle, XCircle} from 'lucide-react';
import { AlertCircle, BarChart2, CheckCircle, XCircle } from 'lucide-react';


const KanbanTaskCard = ({ title, description, userId, users , isFeatureRequest = false }) => {
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
        <div className="task-card">
            <div className="task-header">
                <span className="task-id">{taskId}</span>
                <div className="avatar">
                    <span>👤</span>
                </div>
            </div>
            <h2 className="task-title">{title}</h2>
            <div className="task-footer">
                <div className="icon-container">
                    <AlertTriangle size={16} />
                </div>
                {isFeatureRequest && (
                    <span className="feature-tag">Feature Request</span>
                )}
            </div>
        </div>
    );
};

export default KanbanTaskCard;