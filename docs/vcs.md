
# Git process

## Commit Messages

Commit messages should follow the Semantic Commit Messages format:

```
label(namespace): title

description

footer
```

1. *label* is one of the following:
    - `fix` - bug fixes.
    - `feat` - features.
    - `docs` - changes to docs, e.g. `docs(api.md): ..` to change documentation.
    - `test` - changes to tests infrastructure.
    - `refactor` - refactoring production code, eg. renaming a variable
    - `style` - code style: spaces/alignment/wrapping/cleaned imports etc.
    - `chore` - build-related work, e.g. docker / gitlab / npm / etc.
2. *namespace* is put in parenthesis after label and is optional.
3. *title* is a brief summary of changes.
4. *description* is **optional**, new-line separated from title and is in present tense.
5. *footer* is **optional**, new-line separated from *description* and contains "close" / "fix" attribution to JIRA/Github/Gitlab issues.
6. *footer* should also include "BREAKING CHANGE" if current API clients will break due to this change. It should explain what changed and how to get the old behavior.

Example:

```
fix(Page): fix page.pizza method

This patch fixes page.pizza so that it works with iframes.

Close #123, #234 and #333

BREAKING CHANGE: page.pizza now delivers pizza at home by default.
To deliver to a different location, use "deliver" option:
  `page.pizza({deliver: 'work'})`.
```

[More information](https://docs.gitlab.com/ee/user/project/integrations/jira.html) on Gitlab / JIRA integration.

## Managing GIT branches

By default, I generally favor simple workflows like `Github/Gitlab Flow` instead of `Git Flow` which add an unnecessary develop branch in my humble opinion, does not add value most of the time and make the master branch almost useless. It also complicates the mental model and create more work. `Git Flow` came from people used to svn which tried to reproduce what they already knew instead of embracing git mental model. I also don't see the point to use a branch (master) to archive changes when there is tags for that. In a word, this project does not require `Git Flow`.

### Development

- The `master` branch contains at all time the latest version of code (except feature branches not merged obviously)
- Each new feature/fix is develop in its own branch (which should be tested by a CI process before merging into master)
- The release branch is used to isolate a bunch of commits that will be qualified and released

### Qualification

NA
