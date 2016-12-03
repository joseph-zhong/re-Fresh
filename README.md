# re-Fresh

Manage your food simply: order, track and replenish your perishable items.

## General

- [Devpost Submission](http://devpost.com/software/refresh-xjng7u)
- [Video Demo](https://www.youtube.com/watch?v=yOcjrTD9Xlo)
[![Video Demo](http://img.youtube.com/vi/yOcjrTD9Xlo/0.jpg)](https://www.youtube.com/watch?v=yOcjrTD9Xlo)


## Inspiration
We wanted to build an incredibly simple IoT Solution for tracking perishables, so that you'd never waste food due to expiration dates again.

## What it does
Through our web app, we keep track of an inventory of time-sensitive items in one’s fridge – Our backend services and databases allow us to sync users’ information across multiple devices: mobile phones, tablets, laptops, and even into their smart fridges built-in with Raspberry Pi. A user can scan a receipt of groceries, and ReFresh will tag and aggregate the purchased items and display them with an expiration timer. Users are able to take advantage of Postmates to re-order their food items as the expiration date approaches. Furthermore, ReFresh suggests recipes that use the expiring ingredients and sends text message reminders as items are nearing expiration (via Twilio).

## How we built it

- Google Places/Maps API 
- Postmates API for the re-ordering process
- Spoonacular Recipes API for recipe suggestions using soon-to-be expired ingredients.

