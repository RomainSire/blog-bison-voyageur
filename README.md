# Blog Bison Voyageur

<p align='center'><strong>:warning: :construction: WORK IN PROGRESS :construction: :warning:</strong></p>

## Goals and used technology

I have a travel blog (that I'm taking way too long to update..!). I made it several years ago, and at the time I chose Wordpress CMS to manage it. It was the fastest and easiest solution.  
However now, I learned how to code, and I want to develop my own small blog CMS with:

- Node.Js/Express REST API as a backend
- MongoDB as database
- Single page application (still not sure: improve my skills with Angular or Vue... or learn React or Svelte..! So many choices!!)

## Features

- A landing page with
  - an animated header
  - A button in the header to open the main menu full screen with cool animations
  - a list of the last published articles
- One page for each article (also with the same type of header)
- A simple administration dashboard to :
  - CRUD articles (Write the article in Markdown)
  - CRUD photos
  - Change admin password
  - _Bonus:_ Edit the blog main menu. Still don't know how.. maybe I'll save the menu as a JSON..
- The blog will be very "photography oriented", so I'll have to imagine something convenient and performent for the images.
  - One of these photo features : when I click on any image on the page, it opens a carousel fullscreen displaying all the pictures in this page
  - Automatic resize of the images at the upload : one image 2000px for full screen and one minified image may be 500px or so
- I'll be the only author of the blog, so no need of an over-complicated user management system... However I still want the authentification to be very safe!

## Testing

- TDD! I've never used Test Driven Development... but I'd like to learn!
- Mocha & Chai for the backend tests
