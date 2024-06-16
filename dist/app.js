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
        if (issue.due_date) {
          const dueDate = new Date(issue.due_date);
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

