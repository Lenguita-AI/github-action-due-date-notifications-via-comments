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
        const dueDateMatch = issue.body.match(/Due\s*Date\s*[:|-]?\s*(\d{4}-\d{2}-\d{2})/i);
        if (dueDateMatch) {
          const dueDateStr = dueDateMatch[1];
          const dueDate = new Date(dueDateStr);
          if (dueDate <= notificationDate) {
            octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: `This issue is due in ${daysBeforeDue} day(s).`
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

