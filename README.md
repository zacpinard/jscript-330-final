SELF-EVALUATION
What my project does:
My project creates a functioning backend for a new marathon race platform allowing users to sign up for the platform and then register for various marathon races in National Parks around the world. 

Approach:
I used a similar approach to the week 5 assignment with items and orders.  I used role-based auth with two user types, regular runners, and those with admin privileges.  After logging in, runners can sign up for races, check to see their registrations, and delete registrations to remove themselves from the list. Admins can do all that, plus see all registrations for every race, create and delete races, and edit information about the races.  I used the bcrypt library and a token.js file to handle JWT verification for my middleware setup to handle the authorization.

The DAO pattern included three files: race.js, runner.js, and registration.js.  The registrations were placed in a separate collection in order to more easily allow the runners to see their specific registrations, as well as to allow admins to easily edit race rosters by deleting registrations as their own entity.

What worked well:
The separation of registrations as an entity unique from races or runners, but including ids of both allowed for a much more seamless handling of editing registrations. I imagine it would have been much harder to understand what was going on in the backend if the registrations were attached to races and a non-admin runner needed to go into the races page and edit only their participation in the race, whereas the admin would be able to edit all the runners in a race.

Additionally, the $lookup aggregation pipeline was an important feature that worked well. It is used in the GET /races/:id/runners route, which is available to admins only. Rather than a simple find query, this route uses MongoDB's aggregation pipeline to join three collections in sequence — first matching the target race, then looking up all registrations where the raceId matches, and finally joining those registrations to the runners collection to return the full runner documents as part of the race response. This gives admins a complete race roster in a single API call without needing to make multiple requests.


What didn't work well:
Because I was using MongoDB, I couldn't really add geospatial data very well because of the same limitations I discussed in my Supplemental Presentation.  I would have liked to add an actual route through the park that could have served as a potential race, but I would have needed to have more practice using SQL to interact with a Postgres PostGIS database.

What I learned:
I learned that I can create a functioning backend for my basic idea. I came up with the conservation marathon idea because the first marathon I ever ran was the Hawaii Bird Conservation Marathon on the Big Island. I thought wildlife conservation marathons would be a regular thing but looking around, I didn't actually find many of them.  I learned it is pretty easy to set up a backend for a website like this, and with some more tweaks and added features/details, I could present this project as part of a pitch to a real conservation organization to perhaps make conservation marathons a reality. 

What I would do differently to improve:
I would probably give myself more time to explore the postgres option more, and add important details like a payment screen, data regarding payment status, and links to the organization's page.  I also would create a better front end to see the vision of the project come to life.






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