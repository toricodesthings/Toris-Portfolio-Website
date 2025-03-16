import { Octokit } from "@octokit/core";

// Replace with your GitHub Personal Access Token
const token = '';
const octokit = new Octokit({ auth: token });

// GraphQL query to fetch repositories with all languages and contributions
const query = `
  {
    viewer {
      repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          name
          description
          url
          updatedAt
          languages(first: 100) {
            nodes {
              name
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
      }
    }
  }
`;

async function fetchGitHubData() {
  try {
    const result = await octokit.graphql(query);
    
    // Process repositories: clean title by replacing dashes with spaces and extract all languages
    const repos = result.viewer.repositories.nodes.map(repo => {
      const cleanedTitle = repo.name.replace(/-/g, ' ');
      // Extract language names from the languages nodes array
      const languages = repo.languages.nodes.map(lang => lang.name);
      return {
        title: cleanedTitle,
        description: repo.description,
        url: repo.url,
        updatedAt: repo.updatedAt,
        languages: languages
      };
    });

    // Log the final formatted data
    console.log("GitHub Data:", JSON.stringify({
      totalCommitContributions: result.viewer.contributionsCollection.totalCommitContributions,
      repositories: repos
    }, null, 2));

  } catch (error) {
    console.error("Error fetching GitHub data:", error);
  }
}

fetchGitHubData();