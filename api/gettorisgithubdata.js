import { Octokit } from "@octokit/core";
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const token = process.env.GITHUB_PAT_KEY;
const octokit = new Octokit({ auth: token });

const query = `
  {
    viewer {
      repositories(first: 9, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
  const match = readmeText.match(/## Introduction([\s\S]*?)(?=\n#+\s|$)/);
  return match ? match[1].trim() : null;
}

export default async function handler(req, res) {
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

    return res.status(200).json({
      totalCommitContributions: result.viewer.contributionsCollection.totalCommitContributions,
      repositories: repos
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }
    return res.status(500).json({ message: "Failed to fetch GitHub data", error: error.message });
  }
  
}
