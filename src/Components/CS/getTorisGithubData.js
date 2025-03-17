import { Octokit } from "@octokit/core";

const getEnvVar = (key) => {
  if (typeof window === 'undefined') {
    return process.env[key];
  }
  return import.meta.env[`VITE_${key}`]; //Solely for test .env needs to stay on local machine
};

const token = getEnvVar('GITHUB_PAT_KEY');


const octokit = new Octokit({ auth: token });

const query = `
  {
    viewer {
      repositories(first: 6, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          name
          description
          url
          updatedAt
          languages(first: 10) {
            nodes {
              name
            }
          }
          readme: object(expression: "main:README.md") {
            ... on Blob {
              text
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

function extractIntroduction(readmeText) {
  const match = readmeText.match(/## Introduction([\s\S]*?)(\n#+\s|\n$)/);
  return match ? match[1].trim() : null;
}

export async function fetchGitHubData() {
  try {
    const result = await octokit.graphql(query);

    const repos = result.viewer.repositories.nodes.map(repo => {
      const cleanedTitle = repo.name.replace(/-/g, " ");
      const languages = repo.languages.nodes.map(lang => lang.name);
      let introduction = null;
      if (repo.readme && repo.readme.text) {
        introduction = extractIntroduction(repo.readme.text);
      }

      return {
        title: cleanedTitle,
        description: repo.description,
        url: repo.url,
        updatedAt: repo.updatedAt,
        languages: languages,
        introduction: introduction
      };
    });

    return {
      totalCommitContributions:
        result.viewer.contributionsCollection.totalCommitContributions,
      repositories: repos
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw new Error("Failed to fetch GitHub data");
  }
}
