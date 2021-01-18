# Blog Bison Voyageur

# :warning: :construction: WORK IN PROGRESS :construction: :warning:

## Goals and used technology
So, I have a travel blog (that I'm taking way too long to update..!). I made it several years ago, and at the time I chose Wordpress to manage it. It was the fastest and easiest solution.  
However now, I learned how to code, and I want to develop my own small blog CMS with:
- Node.Js/Express REST API as a backend
- MongoDB as database (I don't think there will be many relations in the database, so...)
- Single page application (I'm still not sure if I will use Angular or Vue)

## Features
### Must-have features
- A landing page with a nice animated header and the last articles
- One page for each article (also with the same type of header)
- A button in the header to open the main menu full screen with nice animations
- The blog will be very "photography oriented", so I'll have to imagine something convenient and performent for the images.
  - One of these photo features : when I click on any image on the page, it opens a carousel fullscreen displaying all the pictures in this page
  - Automatic resize of the images at the upload : one image 2000px for full screen and one minified image may be 500px or so
- I'll be the only author of the blog.. so no need of an over-complicated user management system: just 1 password to access the admin side of the app. Even if I won't manage several users, I want the authentification to be very safe!
- I want to be able to write the article from the CMS in Markdown.
### Bonus features
- A way to manage the main menu from the admin side of the CMS, without code/rebuild/deploy all the frontend would be nice. I'll have to think of a solution for this.
- TDD! I've never used Test Driven Development... but I'd like to learn it!
