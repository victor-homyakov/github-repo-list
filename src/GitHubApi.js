const apiRoot = 'https://api.github.com';

function loadRepositories(url) {
    return fetch(url, {headers: {Accept: 'application/vnd.github.v3+json'}})
        .then(response => {
            console.log(response.ok, response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const link = response.headers.get('Link');
            const paginationLinks = parsePaginationLinks(link);
            return Promise.all([response.json(), paginationLinks]);
            // }).catch(error => {
            //     console.log('error', error);
        });
}

function loadRepositoryInfo(repoFullName) {
    //GET /repos/:owner/:repo
    console.log('loadRepositoryInfo', repoFullName);
    return fetch(apiRoot + '/repos/' + repoFullName, {headers: {Accept: 'application/vnd.github.v3+json'}})
        .then(response => {
            console.log(response.ok, response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            // const link = response.headers.get('Link');
            // const paginationLinks = parsePaginationLinks(link);
            return response.json();
            // }).catch(error => {
            //     console.log('error', error);
        });
}

function parsePaginationLinks(link) {
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

const GitHubApi = {
    apiRoot,
    loadRepositories,
    loadRepositoryInfo,
    parsePaginationLinks
};

export default GitHubApi;
