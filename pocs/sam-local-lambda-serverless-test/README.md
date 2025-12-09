# Install SAM AWS Cli locally

for macos
https://formulae.brew.sh/formula/aws-sam-cli
```bash
brew install aws-sam-cli
```

## Running Lambda tests locally

```bash
❯ ./test.sh

> sam-local-lambda-serverless-test@1.0.0 test
> jest

 PASS  test/handler.test.ts
  sum function
    ✓ should sum two numbers correctly (1 ms)
  handler
    ✓ should return sum result via API (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.527 s, estimated 1 s
Ran all test suites.
```

## Running Lambda function locally with SAM CLI

```bash
❯ ./run-local.sh
No current session found, using default AWS::AccountId
Invoking handler.handler (nodejs20.x)
Unknown 404 - Unable to check if base image is current.

Possible incompatible Docker engine clone employed. Consider `--skip-pull-image` for improved speed, the tradeoff
being not running the latest image.
Removing rapid images for repo public.ecr.aws/sam/emulation-nodejs20.x
Building image..........................
Using local image: public.ecr.aws/lambda/nodejs:20-rapid-x86_64.

Mounting /Users/diegopacheco/git/diegopacheco/typescript-playground/pocs/sam-local-lambda-serverless-test/dist as
/var/task:ro,delegated, inside runtime container
SAM_CONTAINER_ID: c36aa9de843a7f6a1b4d7c893e9b232af77eb59a592c76395ee501688a2e3573
START RequestId: ec5a43e0-fedd-46ac-b22b-cf0796b97b71 Version: $LATEST
END RequestId: eb986256-047c-4c09-811e-51be7c36a4e9
REPORT RequestId: eb986256-047c-4c09-811e-51be7c36a4e9	Init Duration: 1.07 ms	Duration: 985.63 ms	Billed Duration: 986 ms	Memory Size: 128 MB	Max Memory Used: 128 MB
{"statusCode": 200, "body": "{\"result\":8}"}
```