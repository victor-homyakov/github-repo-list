import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Repository from './Repository';

const apiRoot = 'https://api.github.com';

class App extends Component {
    state = {
        isLoading: true,
        repositories: [],
        paginationLinks: []
    };

    componentDidMount() {
        console.log('componentDidMount');
        this.loadRepositories();
    }

    loadRepositories() {
        fetch(apiRoot + '/repositories', {headers: {Accept: 'application/vnd.github.v3+json'}}).then(response => {
            /*
            body: ReadableStream
            bodyUsed: false
            headers: Headers
            ok: true
            status: 200
            statusText: "OK"
            */
            const link = response.headers.get('Link');
            return Promise.all([response.json(), link]);
        }).then(([repositories, link]) => {
            const paginationLinks = link.split(', ');
            console.log('response', repositories, paginationLinks);
            this.setState({isLoading: false, repositories, paginationLinks});
        }).catch(error => {
            console.log('error', error);
        });
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
                <div className="App-content">{repositoriesList}</div>
            </div>
        );
    }
}

export default App;
