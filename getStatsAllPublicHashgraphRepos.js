// Import necessary modules
import fetch from "node-fetch"; // Used to make HTTP requests
import dotenv from "dotenv"; // Used to load environment variables from a .env file
import { writeFileSync } from "fs"; // Used to write output to a file

// Load environment variables from the .env file
dotenv.config();

// Access the GitHub Personal Access Token (PAT) from the environment variable
const token = process.env.GITHUB_TOKEN; // This stores the GitHub PAT securely from the .env file
const org = "hashgraph"; // The GitHub organization we want to query
const per_page = 20; // Number of repos to fetch per page (GitHub allows up to 100)

// Function to get repositories from the GitHub API
async function getRepos(org, page = 1, per_page = 20) {
	const response = await fetch(`https://api.github.com/orgs/${org}/repos?type=public&per_page=${per_page}&page=${page}&archived=false`, {
		headers: {
			Authorization: `token ${token}`, // Use the token to authenticate the API request
		},
	});

	if (!response.ok) {
		throw new Error(`Error fetching repos: ${response.statusText}`);
	}

	return response.json();
}

// Function to aggregate stars, forks, and URLs from the repositories and export to CSV
async function aggregateStarsAndForks(org) {
	let page = 1; // Initialize the page counter for pagination
	let allRepos = []; // This array will hold all the repositories fetched across multiple pages
	let repos; // Temporary variable to hold each page of repository data

	// Loop through paginated results
	do {
		repos = await getRepos(org, page); // Fetch repos for the given page
		allRepos = allRepos.concat(repos); // Concatenate the fetched repos into allRepos array
		page++;
	} while (repos.length === per_page); // Continue fetching until we receive less than 'per_page' repos

	// Filter out archived repositories
	const publicNonArchivedRepos = allRepos.filter((repo) => !repo.archived);

	// Aggregate stars and forks
	const totalStars = publicNonArchivedRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
	const totalForks = publicNonArchivedRepos.reduce((acc, repo) => acc + repo.forks_count, 0);

	// Prepare the CSV content
	let csvContent = "html_url,forks_count,stargazers_count\n"; // CSV header

	// Loop through each repo and append its data as a CSV row
	publicNonArchivedRepos.forEach((repo) => {
		const row = `${repo.html_url},${repo.forks_count},${repo.stargazers_count}\n`; // CSV row
		csvContent += row;
	});

	// Log the results to the console
	console.log(`Total Repos: ${publicNonArchivedRepos.length}`);
	console.log(`Total Stars: ${totalStars}`);
	console.log(`Total Forks: ${totalForks}`);

	// Get today's date and format it as yyyy-mm-dd
	const today = new Date();
	const formattedDate = today.toISOString().split("T")[0]; // Extract the yyyy-mm-dd part from ISO string

	// Generate the file name with the current date
	const fileName = `./hashgraph-public-repos-stats/hashgraph-repos-stats-${formattedDate}.csv`;

	// Write the CSV content to a file with the generated file name
	writeFileSync(fileName, csvContent, "utf8");

	// Log the file creation with the dynamic file name
	console.log(`CSV file created: ${fileName}`);
}

// Call the function to aggregate stars, forks, and URLs, and output to a CSV file
aggregateStarsAndForks(org).catch((error) => console.error(error));
