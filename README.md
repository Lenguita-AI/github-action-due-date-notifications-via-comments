# Due Date Notifications Via Comments

This GitHub Action adds comments to issues with approaching deadlines as a proxy for due date notifications. You will need two accounts to use this action effectively: one where you'd like to receive your notifications, and a bot account which will create the comments via the GitHub action using a Personal Access Token.

## Workflow Configuration

Create a workflow file inside your repository `.gitignore/workflows/` to schedule the action to run daily:

```yaml
name: Due Date Notifications Via Comments

on:
  schedule:
    - cron: '0 0 * * *'  # Runs daily at midnight (UTC on GH servers)
  workflow_dispatch:

jobs:
  notify:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.7

      - name: Run due date notifications via comments
        uses: ./
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          days-before-due: 3  # Adjust this depending on your preference to be notified
```

- If you want to adjust the cron schedule, you can consult [Crontab Guru](https://crontab.guru/) for a visual guide.
- You can adjust the `days-before-due` field to adjust your needs.

### Setting Up

1. **Create a Bot Account**:
   - Go to [GitHub](https://github.com/) and sign up for a new account. Choose a username that reflects its purpose, such as `your-username-bot`.
   - Use a different email address than your main account.

2. **Generate a Personal Access Token from the Bot Account**:
   - Log in to the bot account.
   - Go to [GitHub Settings](https://github.com/settings/tokens).
   - Click on "Generate new token".
   - Select the "workflow" scope.
   - Click "Generate token" and copy the token.

3. **Add the Personal Access Token as a Secret**:
   - Log in to your main account.
   - Go to your repository on GitHub.
   - Navigate to `Settings` > `Security` > `Secrets and variables` > `Actions` > `New repository secret`.
   - Add the following secret:

     - **Name**: `GH_TOKEN`
     - **Value**: Your personal access token from the bot account

4. **Add Due Date to Issues**:
   - Anywhere inside the body of your issue, you can add the key word `Due:` followed by the date in YYYY-MM-DD format. For example, you can do this in the heading of your issue (or anywhere else in the body of the issue), assuming it's June 16, 2024:
     ```
     ---
     Due: 2024-06-16
     ---
     ```

### Example Issue Body

```
# Example Issue

This is an example issue.

Due: 2024-06-16

```

### How It Works

- The action will run daily at midnight UTC and manually if triggered via the Actions tab.
- It will check open issues for a due date specified in the format:

  ```
  Due: YYYY-MM-DD
  ```

- If an issue is within the specified `days-before-due`, it will add a comment to the issue indicating the number of days remaining until the due date.

### Sample Notification Comment

```
This issue is due in 3 day(s) on 2024-06-16. Please ensure it is completed on time.
```

## Enable Comment Notifications on Issues

To get notified when a comment is added to an issue via this GitHub Action, follow these steps:

1. **Watch the Repository**:
   - Go to the GitHub repository where the action is set up.
   - Click on the "Watch" button at the top right of the repository page.
   - Select the "Watching" option to get notified about all conversations, including comments on issues.

2. **Enable Notifications for Issue Comments**:
   - Make sure your GitHub account settings are configured to receive notifications for issue comments.
   - Go to your [GitHub notification settings](https://github.com/settings/notifications).
   - Ensure that "Email" or "Web" notifications are enabled for "Issues" and "Pull requests".

3. **Check Your Notification Preferences**:
   - Verify that you are not ignoring notifications from this repository.
   - In your [notification settings](https://github.com/settings/notifications), under "Custom routing", ensure that the repository is not set to "Ignore".

## Development

### Build the Project

If you're making changes to the code, ensure that you build the project before pushing:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. Make sure you use [@vercel/ncc](https://github.com/vercel/ncc) to compile your code and modules. Look at the GitHub documentation for [Creating a JavaScript Action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action) if needed.

## Contributing

Feel free to open issues or submit pull requests if you have suggestions for improvements or bug fixes.

## Similar tools

This action was inspired by [Alex Leventer](https://github.com/alexleventer)'s [Due Dates](https://github.com/marketplace/actions/due-dates
) action, which tags issueas as `Due in one week` or `Overdue` and it should work with it at least until [Due Dates v1.1.0](https://github.com/alexleventer/github-issue-due-dates-action/releases/tag/1.1.0).

