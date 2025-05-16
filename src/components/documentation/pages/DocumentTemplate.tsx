import React from 'react';

interface DocumentTemplateProps {
  title: string;
  description: string;
  content: React.ReactNode;
}

/**
 * Reusable documentation page template
 */
const DocumentTemplate: React.FC<DocumentTemplateProps> = ({ title, description, content }) => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>{title}</h1>
      <p className="lead text-lg text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {content}
    </article>
  );
};

export default DocumentTemplate;
