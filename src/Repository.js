import React, {Component} from 'react';
import './Repository.css';
import GitHubApi from './GitHubApi';

class Repository extends Component {
    state = {
        parent: null,
        isLoading: false
    };

    onShowParentInfoClick(e) {
        e.preventDefault();
        //console.log('toggle', this.state.isExpanded);
        // this.setState({isExpanded: !this.state.isExpanded});
        this.setState({isLoading: true});

        const {repository} = this.props;
        GitHubApi
            .loadRepositoryInfo(repository.full_name)
            .then(repositoryInfo => {
                console.log('loadRepositoryInfo', repositoryInfo);
                this.setState({isLoading: false, parent: repositoryInfo.parent});
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    renderParentInfo() {
        const {repository} = this.props;

        if (!repository.fork) {
            return null;
        }

        if (this.state.isLoading) {
            return <span>loading...</span>;
        }

        if (this.state.parent) {
            return (
                <span>
                    Parent: <a href={this.state.parent.html_url} target="_blank">{this.state.parent.full_name}</a>
                </span>
            );
        }

        return <a href="#" onClick={e => this.onShowParentInfoClick(e)}>parent repo</a>;
    }

    render() {
        const {repository} = this.props;

        return (
            <div>
                <a className="Repository-name" href={repository.html_url} target="_blank" rel="noopener">
                    {repository.full_name}
                </a>
                {this.renderParentInfo()}
                <div className="Repository-description">
                    {repository.description || '(no description)'}
                </div>
            </div>
        );
    }
}

export default Repository;
