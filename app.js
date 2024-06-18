const core = require('@actions/core');
const github = require('@actions/github');

function run() {
  try {
    const token = core.getInput('GH_TOKEN');
    const daysBeforeDue = parseInt(core.getInput('days-before-due'), 10);
    const octokit = github.getOctokit(token);
    const { context } = github;
    const { owner, repo } = context.repo;

    octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open'
    }).then(response => {
      const issues = response.data;
      const today = new Date();
      const notificationDate = new Date();
      notificationDate.setDate(today.getDate() + daysBeforeDue);

      issues.forEach(issue => {
        const dueDateMatch = issue.body.match(/Due\s*[:|-]?\s*(\d{4}-\d{2}-\d{2})/i);
        if (dueDateMatch) {
          const dueDateStr = dueDateMatch[1];
          const dueDate = new Date(dueDateStr);

          // Calculate the difference between today and the due date in days
          const timeDiff = dueDate.getTime() - today.getTime();
          const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

          if (daysUntilDue < -2) {
            // No comment if due date was more than 2 days ago
            return;
          } else if (daysUntilDue === -1) {
            octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: `The due date of this issue has **pased**.`
            }).catch(error => core.setFailed(error.message));
          } else if (daysUntilDue === 0) {
              octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: `The due date of this issue is **today**.`
            }).catch(error => core.setFailed(error.message));
          } else if (dueDate <= notificationDate) {
            octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: `This issue is due in ${daysUntilDue} day(s), on ${dueDateStr}.`
            }).catch(error => core.setFailed(error.message));
          }
        }
      });
    }).catch(error => core.setFailed(error.message));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
