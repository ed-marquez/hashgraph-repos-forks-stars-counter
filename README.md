# Hashgraph Repositories Stats Aggregator

This Node.js script fetches public, non-archived repositories from the `hashgraph` GitHub organization and aggregates information about stars, forks, and repository URLs. The results are saved in a CSV file with the current date.

## Features

- Fetches all public and non-archived repositories from the Hashgraph organization.
- Aggregates repository URLs, stars, and forks.
- Outputs the data in a CSV file named `hashgraph-repos-stats-YYYY-MM-DD.csv`.

## Prerequisites

- Node.js installed on your system.
- A GitHub Personal Access Token (PAT) for authenticating requests to the GitHub API.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ed-marquez/hashgraph-repos-forks-stars-counter.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hashgraph-repos-forks-stars-counter
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Copy and rename `.env.sample` to `.env` in the root directory and add your GitHub PAT:
   ```bash
   cp .env.sample .env
   ```
5. Run the script (using any of the following):

   ```bash
   npm start
   ```

   ```bash
   npm run start
   ```

   ```bash
   node index.js
   ```

This will fetch the repository data and generate a CSV file with the repository URLs, forks, and stars.

## Output

The script generates a CSV file named `hashgraph-repos-stats-YYYY-MM-DD.csv` containing the following columns:

- `html_url`: URL of the repository.
- `forks_count`: Number of forks.
- `stargazers_count`: Number of stars.
