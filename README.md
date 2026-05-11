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
  At least one of text search, aggregations, or lookups:



5. A timeline for what project components you plan to complete, week by week, for the remainder of the class. 

5/13-5/20


5/20-5/27


5/27-6/5