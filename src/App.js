import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Repository from './Repository';
import GitHubApi from './GitHubApi';

class App extends Component {
    state = {
        isLoading: true,
        repositories: [],
        paginationLinks: {}
    };

    componentDidMount() {
        GitHubApi
            .loadRepositories(GitHubApi.apiRoot + '/repositories')
            .then(([repositories, paginationLinks]) => {
                this.setState({isLoading: false, repositories, paginationLinks});
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    onPaginationLinkClick(e, rel) {
        e.preventDefault();
        const url = this.state.paginationLinks[rel];
        if (url) {
            this.loadRepositories(url);
        }
    }

    renderPaginationLinks() {
        const paginationLinks = this.state.paginationLinks;
        return [
            paginationLinks.first ? <a key="first" href={paginationLinks.first}
                onClick={e => this.onPaginationLinkClick(e, 'first')}>first</a> : null,
            paginationLinks.next ? <a key="next" href={paginationLinks.next}
                onClick={e => this.onPaginationLinkClick(e, 'next')}>next</a> : null
        ];
    }

    render() {
        const header = (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to React</h2>
            </div>
        );

        const repositories = this.state.repositories;
        const message = this.state.isLoading ? 'Loading...' : `Loaded, ${repositories.length} repositories found`;
        const repositoriesList = repositories.map(r => {
            return <Repository key={'repo-' + r.id} repository={r} />;
        });

        return (
            <div className="App">
                {header}
                <p className="App-intro">{message}</p>
                <p className="App-pagination">{this.renderPaginationLinks()}</p>
                <div className="App-content">{repositoriesList}</div>
                <p className="App-pagination">{this.renderPaginationLinks()}</p>
            </div>
        );
    }
}

export default App;
