import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Repository from './Repository';

const apiRoot = 'https://api.github.com';

class App extends Component {
    state = {
        isLoading: true,
        repositories: [],
        paginationLinks: {}
    };

    componentDidMount() {
        this.loadRepositories(apiRoot + '/repositories');
    }

    loadRepositories(url) {
        fetch(url, {headers: {Accept: 'application/vnd.github.v3+json'}}).then(response => {
            console.log(response.ok, response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const link = response.headers.get('Link');
            return Promise.all([response.json(), link]);
        }).then(([repositories, link]) => {
            const paginationLinks = this.parsePaginationLinks(link);
            //console.log('repositories', repositories);
            repositories.forEach(r => {
                if (r.fork) {
                    console.log(r, 'is forked');
                }
            });
            this.setState({isLoading: false, repositories, paginationLinks});
        }).catch(error => {
            console.log('error', error);
        });
    }

    parsePaginationLinks(link) {
        if (!link) {
            return {};
        }

        const links = link.split(', ') || [];
        const paginationLinks = {};
        links.forEach(p => {
            const parts = p.split('; rel=');
            let link = parts[0].replace(/(^<)|(>$)/g, '');
            const rel = parts[1].replace(/(^")|("$)/g, '');
            if (rel === 'first') {
                // ugly hack; original library should know how to process this
                link = link.replace('{?since}', '');
            }
            paginationLinks[rel] = link;
        });

        console.log('paginationLinks', links, '=>', paginationLinks);
        return paginationLinks;
    }

    onPaginationLinkClick(e, rel) {
        e.preventDefault();
        const url = this.state.paginationLinks[rel];
        // console.log('go to page', url);
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
