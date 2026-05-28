Project Update (Proof of Concept)
I have been using the week 5 assignment as a template for creating this project and replacing items with races and users with runners. I had to learn how to incorporate the architecture of a separate registrations model and dao to relate multiple runners and multiple races.  I have gone through the models and daos, but still need to work on converting the routes.



1. A description of your project's context/subject matter (i.e. gaming, project management, image processing, etc.).

My project will create an API for runners to sign yp for a series of hypothetical marathon races called "Wild Runs" that raise money for wildlife conservation organizations. I will build the common routes for signup, login, and changing passwords. My API will model a simple website, with races and runners. Normal users should not be able to create or update races, but they will be able to sign up for specific races. I will use simple authorization to give more privileges to race admin users.

2. A description of what problem your project seeks to solve.

My project seeks to create a template backend for a series of marathon race charity events that other organizations already have. These races will be run in specific world-famous National Parks and Refuges around the world. Because there are multiple events, users will be able to sign up for one or many. Because more National Parks and Refuges might want to participate, authorized users will need to be able to add race events. All this information needs to exist in one source for racers and administrators to access in order to successfully plan these events.

3. A description of what the technical components of your project will be, including: the routes, the data models, any external data sources you'll use, etc.
I will need routes for a racer to sign up, login, and change password. This will use a `Runner` model.  I will also need routes for races using a `Race` model. I will not be using external APIs or datasets, but rather I will create my own dataset.


4. Clear and direct call-outs of how you will meet the various project requirements.

Your project will require an Express API using:
  Authentication and Authorization: JWTs from jsonwebtoken, there will be a 'role' field on runner to determine if they are regular participant or an admin
  2 sets of CRUD routes (not counting authentication): Runner and Race
  Indexes for performance and uniqueness when reasonable: Runner.email for runners and race.id for races
  At least one of text search, aggregations, or lookups: I will use a $lookup aggregation joining runners to their their registered races.



5. A timeline for what project components you plan to complete, week by week, for the remainder of the class. 

5/13-5/20
Foundation: set up package.json, Express server, MongoDB connection, folder structure mirroring week 5 project with items and orders and replacing with races and runners schemas. Building daos/runner.js createRunner, getByEmail, and updatePassword. Building routes/auth.js signup, login, change password from week 5, and testing in Postman  

5/20-5/27
CRUD Routes: Building daos/races.js GET all, GET by ID, POST/PUT.  Writing middleware. Implementing $lookup aggregation as a race roster or runner's race schedule

5/27-6/5
Finshing Up: Creating initial database with a few races and runners so the API feels live. Error handling. Final Postman checks, preparing presentation.