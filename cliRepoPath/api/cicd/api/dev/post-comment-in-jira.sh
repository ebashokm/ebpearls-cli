#!/bin/bash 
set -e

LOG_FILE="/home/ebthemes/dev/validate_service.log"
#LOG_FILE="$(pwd)/test.log"
# touch "/home/ebthemes/dev/validate_service.log"

if [ -z "$LOG_FILE" ]; then
  echo "LOG_FILE is not set"
else
  echo "[$(date)] ===== Starting ValidateService ====="   >> $LOG_FILE
fi


echo "test " >> $LOG_FILE


echo "[$(date)] ======= Automation Triggre Started ======" >> $LOG_FILE

#trigger bitbucket test pipeline
BITBUCKET_IDENTITY="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name B_IDENTITY | base64 -d )"
BITBUCKET_REPO_SLUG="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name BITBUCKET_REPO_SLUG | base64 -d )"
cd /home/ebthemes/dev
latest_merged_branch=$(git log --merges --first-parent -1 --pretty=%B)
#JIRA_ISSUE_KEY="ET-3105"
JIRA_ISSUE_KEY=$(echo "$latest_merged_branch" | grep -oE '[A-Z]{2,10}-[0-9]+' | head -n1)

curl --location "https://api.bitbucket.org/2.0/repositories/ebpearls28/$BITBUCKET_REPO_SLUG/pipelines" \
--header 'Content-Type: application/json' \
--header "Authorization: Basic $BITBUCKET_IDENTITY" \
--data "{
        \"target\": {
          \"ref_type\": \"branch\",
          \"type\": \"pipeline_ref_target\",
          \"ref_name\": \"main\"
        },
        \"variables\": [
          {
            \"key\": \"BRANCH_NAME\",
            \"value\": \"${JIRA_ISSUE_KEY}\"
          }
        ]
      }"



echo "[$(date)] ======= Automation Triggred ======" >> $LOG_FILE



# JIRA_BASE_URL="https://ebp.atlassian.net"
# JIRA_ISSUE_KEY=""  # pass this dynamically or hardcode for demo
# JIRA_USER_EMAIL="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name Jira-User-Email | base64 -d )"
# JIRA_API_TOKEN="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name Jira-API-Token | base64 -d )"

      
# # Get current branch explicitly (optional)
# # current_branch=$(git symbolic-ref --short HEAD)
# # echo "Current branch: $current_branch" | tee -a $LOG_FILE

# CURRENT_DIR=$(pwd)
# # Get the latest merged branch name in current branch
# cd /home/ebthemes/dev
# latest_merged_branch=$(git log --merges --first-parent -1 --pretty=%B)
# #latest_merged_branch="feature/ETM-167-faq-feature-automation"
# cd $CURRENT_DIR

# current_branch="dev"
# #latest_merged_branch="ET-3105-updated"
# echo "[$(date)] ===== Latest merged branch: $latest_merged_branch"  >> $LOG_FILE

# if [[ -n "$latest_merged_branch" ]]; then
#   echo "Latest branch merged into '$current_branch': $latest_merged_branch"
#   JIRA_ISSUE_KEY=$(echo "$latest_merged_branch" | grep -oE '[A-Z]{2,10}-[0-9]+' | head -n1)
#   echo "Jira issue key: $JIRA_ISSUE_KEY" >> $LOG_FILE
# else
#   echo "No recent merges found on branch '$current_branch' or commit message pattern did not match."
# fi

# if [ -z "$JIRA_ISSUE_KEY" ]; then
#   echo "No Jira issue key found in branch name so not running the automation tests" >> $LOG_FILE
#   exit 1
# fi

# COMMENT="DEV-DEPLOYMENT-COMPLETED"
# echo $COMMENT >> $LOG_FILE

# # AUTH=$(echo -n "$JIRA_USER_EMAIL:$JIRA_API_TOKEN" | base64)

# export AUTH=$(echo -n "$JIRA_USER_EMAIL:$JIRA_API_TOKEN" | base64 | tr -d \\n)

# # echo "$AUTH" | tee -a $LOG_FILE



# RESPONSE=$(curl --location "https://ebp.atlassian.net/rest/api/3/issue/$JIRA_ISSUE_KEY/comment" \
# --header 'Content-Type: application/json' \
# --header "Authorization: Basic $AUTH" \
# --data "{
#   \"body\": {
#     \"type\": \"doc\",
#     \"version\": 1,
#     \"content\": [
#       {
#         \"type\": \"paragraph\",
#         \"content\": [
#           {
#             \"type\": \"text\",
#             \"text\": \"${COMMENT}\"
#           }
#         ]
#       }
#     ]
#   }
# }"
# )



