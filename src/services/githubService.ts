import axios from 'axios'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

function getAuthHeaders() {
  if (GITHUB_TOKEN) {
    return { Authorization: `token ${GITHUB_TOKEN}` }
  }
  return {}
}

export async function fetchRepoCommits(repoUrl: string, since: Date, until: Date) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) throw new Error('Invalid GitHub URL')
  
  const [, owner, repo] = match
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`
  
  const response = await axios.get(apiUrl, {
    params: {
      since: since.toISOString(),
      until: until.toISOString(),
      per_page: 100
    },
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...getAuthHeaders()
    }
  })
  
  return response.data
}

export async function fetchRepoMetadata(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) throw new Error('Invalid GitHub URL')
  
  const [, owner, repo] = match
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
  
  const response = await axios.get(apiUrl, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...getAuthHeaders()
    }
  })
  
  return {
    createdAt: new Date(response.data.created_at),
    updatedAt: new Date(response.data.updated_at),
    stars: response.data.stargazers_count,
    forks: response.data.forks_count,
    isPrivate: response.data.private
  }
}