# Habit Tracker

## MVP

The user should be able to create an account, log in, add new habits, track their own progress, see what their current streak is, see their longest ever streak, visualize it over a calendar.

## Backend

Made with flask, sqlite and jwt for auth. Now the actual flask and sqlite part were just fine, i really enjoyed them it seemed pretty intuitive, the same however cannot be said for the jwt. In the past ive worked with jwt tokens, so i thought why not try something new with csrf access cookies, which ended up causing me a hell of a lot of trouble, since i found out what the samesite and secure properties for this cookie do, basically if you set up samesite none it needs to be https, which you cant get on a dev build, so i had to use samesite lax which in turn meant the cookie could now be processed in http aswell, what i did not account for, is that the url needs to be the same for it to actually process, i spent maybe an hour troubleshooting why my cookie between 127.0.0.1 and localhost was not working, its because both had to be the exact same domain, so 127.0.0.1, which then made me realise that this wont work in a prod build either, since the urls will not work no matter what, so i just switched to a more usual approach, sending the jwt over in the resp message, and setting it in local storage, a bit of a more boring approach, but it works. As for the other stuff, all the analytics like calculating todays progress, or your longest streak, happen in the backend. I also implemented cascading, meaning if a user ever deletes their account, their habits and logs go with them.

### API and rate limiting

My Apis follow a pretty standard convention, for habits its /api/habits, for any individual habit its api/habits/<habit:id>/logs, and then i also have a api/habits/<habit:id>/stats which is for the longest streak calculation, and an api/habits/daily which returns your progress for the day. I also have the usual health and me endpoints implemented with rate limiting across the board. I used the usual flask limiter library, only edited my api/login endpoint to have 5 per minute login attempts, obviously since this is just a hobby project, this doesnt need to be any more.

## Frontend

I used angular since i wanted to learn how to work with it, and to be honest i think i got a decent grasp of how it works, although i did find it very awkward and weird at times. My whole flow is implementing a router outlet, and then when you load onto a certain url, it shows a certain component, standard stuff, i have basically three main components, Landing -> which includes the reroute to login and register, which reroute to Dashboard -> which has all your habits, which in turn have the ability to rename and remove, and also the reroute to the detailed view, your daily stats, and also the ability to add a new habit, and Detailed view, where you can see your progress on a calendar, flip through the calendar, and also see your longest ever streak. Theres also a header for convenient navigation and logging out, implemented on the dashboard and detailed components. Aside from this theres not that much that went into it, i think i got the basics down very fast, but i did get tripped up at first at sending signals from a child component to a parent component, but it got better with time.

## Testing

I used pytest, jest and playwright for what i would say is a pretty good test coverage.

### Pytest

My backend is tested for basically everything it does, from adding/removing a user, adding renaming removing a habit, adding a log, aswell as working auth and rate limiting, i tested for both success, to make sure the stuff is how i expected, and also for failures, so it fails gracefully, returns the right http codes aswell as the right message.

### Jest

I would say this is the one i struggled with the most at first, its a bit convoluted, im mainly only testing for a couple of things, which include form validation, my helper functions, which just make sure the data i get is processed correctly, and just making sure nothing crashes unexpectedly.

### Playwright

All in all i had the most fun writing the playwright tests, its the most intuitive and actually tests the app fully. I have three main tests, one which makes sure you cant log in with the wrong credentials, one which makes sure if youre not logged in you cant do anything in the app, you just get redirected to the login page, and one which checks the entire flow of the app, register -> login -> add habit -> add log -> rename habit -> delete habit -> check for cascading -> logout. This test works well locally, but ive had quite the trouble making it work in git ci, and to be honest i have no idea why, its usually 8 tests pass, 1 fails which makes no sense, maybe its something to do with rate limiting, not sure.

## Git ci and Docker

As a bit of a change and maybe some sort of evolution, i decided to try out Git ci and docker, since i wanted to learn them and i would say it went pretty well. As for git ci, i had a bit of trouble setting up my ci.yml, needed to figure out how to do it, but once i got it i havent had to edit it at all, and i think for anything bigger scale than just a small project, its worth to have it to see how the project behaves locally as well as on the platform. As for docker i only did this today, and i expected it to be very difficult, but to be honest it went just fine, and it seems really convenient. I have two dockerfiles and one docker-compose, so i can just run it up with one command, and dont need to worry about anything else locally. One issue i did run into is the same i mentioned on the backend segment, i need to run the frontend on 127.0.0.1, but thats just my fault.

## Deployment

I used the well trodden path of vercel for frontend, render for backend, now it did need some basic setup to work and make the two communicate, but it works well and im happy that both the docker works locally, and the deployed works on the web.

## Final

Im pretty happy with how it turned out, im aware that the frontend is a bit crude at times, i couldve added more animations, hover active states, and made it more polished, i do agree. The main thing for me was however to learn angular and flask, and i would say i did a pretty good job of that.
