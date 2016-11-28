import React from 'react';
import './Repository.css';

const Repository = ({repository}) => {
    return (
        <div>
            <a className="Repository-name" href={repository.html_url} target="_blank" rel="noopener">
                {repository.name}
            </a>
            <div className="Repository-description">
                {repository.description || '(no description)'}
            </div>
        </div>
    );
};

export default Repository;
