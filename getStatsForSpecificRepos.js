// Import necessary modules
import fetch from "node-fetch"; // Used to make HTTP requests
import dotenv from "dotenv"; // Used to load environment variables from a .env file
import { writeFileSync, readFileSync } from "fs"; // Used to read input and write output to files

// Load environment variables from the .env file
dotenv.config();

// Access the GitHub Personal Access Token (PAT) from the environment variable
const token = process.env.GITHUB_TOKEN; // This stores the GitHub PAT securely from the .env file

// Read the list of repositories from a JSON file
const repoUrls = JSON.parse(readFileSync("specific-repos.json", "utf8"));

// Function to extract owner and repo name from a GitHub repo URL
function extractOwnerAndRepo(url) {
	const regex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
	const match = url.match(regex);
	if (match && match.length >= 3) {
		return { owner: match[1], repo: match[2] };
	} else {
		throw new Error(`Invalid GitHub repo URL: ${url}`);
	}
}

// Function to get repository data from the GitHub API
async function getRepoData(owner, repo) {
	const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
		headers: {
			Authorization: `token ${token}`, // Use the token to authenticate the API request
		},
	});

	if (!response.ok) {
		throw new Error(`Error fetching repo ${owner}/${repo}: ${response.statusText}`);
	}

	return response.json();
}

// Function to aggregate stars, forks, and URLs from the repositories and export to CSV
async function aggregateStarsAndForks(repoUrls) {
	let totalStars = 0;
	let totalForks = 0;

	// Prepare the CSV content
	let csvContent = "html_url,forks_count,stargazers_count\n"; // CSV header

	// Loop through each repo URL
	for (const url of repoUrls) {
		try {
			const { owner, repo } = extractOwnerAndRepo(url);
			const repoData = await getRepoData(owner, repo);

			// Aggregate stars and forks
			totalStars += repoData.stargazers_count;
			totalForks += repoData.forks_count;

			// Append repo data to CSV content
			const row = `${repoData.html_url},${repoData.forks_count},${repoData.stargazers_count}\n`; // CSV row
			csvContent += row;
		} catch (error) {
			console.error(error);
		}
	}

	// Log the results to the console
	console.log(`Total Repos: ${repoUrls.length}`);
	console.log(`Total Stars: ${totalStars}`);
	console.log(`Total Forks: ${totalForks}`);

	// Get today's date and format it as yyyy-mm-dd
	const today = new Date();
	const formattedDate = today.toISOString().split("T")[0]; // Extract the yyyy-mm-dd part from ISO string

	// Generate the file name with the current date
	const fileName = `./specific-repos-stats/specific-repos-stats-${formattedDate}.csv`;

	// Write the CSV content to a file with the generated file name
	writeFileSync(fileName, csvContent, "utf8");

	// Log the file creation with the dynamic file name
	console.log(`CSV file created: ${fileName}`);
}

// Call the function to aggregate stars, forks, and URLs, and output to a CSV file
aggregateStarsAndForks(repoUrls).catch((error) => console.error(error));
