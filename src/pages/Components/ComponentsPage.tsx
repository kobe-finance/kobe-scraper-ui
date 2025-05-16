import React from 'react';
import ComponentDemo from '../../components/examples/ComponentDemo';

const ComponentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Component Library</h1>
      </div>
      
      <ComponentDemo />
    </div>
  );
};

export default ComponentsPage;
