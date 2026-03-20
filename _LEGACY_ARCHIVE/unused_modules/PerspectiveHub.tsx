/**
 * ARCHIVE NOTICE
 * Original Use: Used for 3D spatial viewing.
 * Moved to: unused_modules
 */

import SpatialHub from './spatial/SpatialHub';
import type { KaizenProject } from '../types';

interface PerspectiveHubProps {
    projects: KaizenProject[];
    onUpdateProjects: (projects: KaizenProject[]) => void;
    activeModel: string | null;
    onClearActiveModel: () => void;
}

export default function PerspectiveHub({
    projects,
    onUpdateProjects,
    activeModel,
    onClearActiveModel
}: PerspectiveHubProps) {
    return (
        <div className="perspective-hub-wrapper" style={{ padding: '0', height: '100%', overflowY: 'auto' }}>
            <SpatialHub
                projects={projects}
                onUpdateProjects={onUpdateProjects}
                activeModel={activeModel}
                onClearActiveModel={onClearActiveModel}
            />
        </div>
    );
}
