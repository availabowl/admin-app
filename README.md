# Availabowl Admin V2.1 - Boilerplate

Next.js app that we use for managing schools in a nice UI. Not included in the public repository is our Prisma ORM.
Since update 2.1.0 of our administrator app, it can be containerized as a Docker image, and we have included our Prisma API code.

## API
Our PostgreSQL data is managed within this administrator app. For development purposes, we advise you to be aware
that we handle violations and data integrity of our schema within our database. This is so we can reduce
codebase logic.

## Requirements

- Node v20.x.x (at time of writing)
- Next.js 14.1 (at time of writing)

## Installation

1. Clone this repository: `git clone git@github.com:git@github.com:availabowl/admin-app.git`
2. Change directories into the project root: `cd admin-app`
3. Run `cp sample.env .env` and then modify your new `.env` file with the appropriate credentials. This includes AWS, Jira, and PostgreSQL credentials.

## Development

1. In the root of the project, run `npm run dev`.
2. This will perform the initial build and then launch your browser to your local site (the first time you do this, it may take a few minutes).
3. Changing files in this state will also hot reload the files.

## Build (non-Docker)

1. In the root of the project, run `npm run build`.
2. The site will be built into the `public` folder of the project root.
3. To start the production build, run `npm run start`.

## Build (Docker)

As of version 2.1, I have streamlined the boilerplate application to also be run with Docker. However, there are some prerequisites that have to be done.

### Prerequisites

Since the environmental variable ```DATABASE_URL``` is required at build-time of our Docker image, you are required to have your Prisma ORM database URL (string) passed in as an argument. How we do this is passing ```DATABASE_URL``` as an exportable environmental variable within our command line environment, such as:

```export DATABASE_URL=postgresql://user:password@localhost:5432/mydb```

### Usage
Once you've specified a URL path to your database, you can run the following npm script (referenced in ```package.json```):

```$ npm run docker-build```

Once the Docker image has successfully been containerized, you can run the following  npm script command to start it (also referenced in ```package.json```):

```$ npm run docker-run```

To view what each command does under the hood, you can look at their definitions in ```package.json```.

## Deployment

This web app is built in Next.js, and is containerized with Docker. As of now, we do not have the app hosted on the web for security purposes. However, the source code can serve as a boilerplate for those looking to build their own administrator apps.

