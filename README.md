# Availabowl Admin V2.1 - Boilerplate

Next.js app that we use for managing schools in a nice UI. Not included in the public repository is our Prisma ORM.
Since update 2.1.0 of our administrator app, part of our API schema is public through this.

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

## Build

1. In the root of the project, run `npm run build`.
2. The site will be built into the `public` folder of the project root.
3. To start the production build, run `npm run start`.

## Deployment

This web app is built in Next.js. As of now, we do not have the app hosted on the web for security purposes. However, the source code can serve as a boilerplate for those looking to build their own administrator apps.