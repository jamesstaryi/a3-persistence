## My TODO List

Glitch link: http://a3-jamesstaryi.glitch.me

**Accounts to login with**:

Account 1:
- Username: user1
- Password: pass1

Account 2:
- Username: user2
- Password: pass2

This is a pretty simple and straightforward website to keep track of one's todo list. A user can input a todo item and also the corresponding due date(or leave it blank). It then adds it the the list at the bottom of the page. The user can then check off completed actions, inline edit the todo item, view the item's urgency, or delete the todo item.

## Baseline Requriements
- Server using Express
- Results functioanlity which shows data associated with a user
- Form/Entry functionality that allows user to add, modify(can edit TODO text only), delete items associated with the account
- Persistent data storage using mongodb
- CSS Framework of Water.css

HTML:
- input and checkboxes used
- display of data for the logged in user

CSS:
- CSS styling from Water.css with minor other css

JavaScript:
- get/fetch from the server

Node.js:
- Server using Express and database of mongodb

General:
- 100% on Performance, Best Practices, Accessibility, and SEO using Google Lighthouse


**Application Goal**: To allow users to keep track of things that they need to do.

**Challenges**: The main challenge that I faced while creating the application was on how I was going to implement the login system. In the end I tied each todo item to a user ID.

**Authentication**: I chose to use a simple username and password login system as it was the quickest and easiest way.

**CSS Framework**: I ended up using Water.css as my framework because it seemed easy to implement and had a dark theme that closely matched my previous iteration.

**Middleware**:
- express.static: serves static files
- cookie-session: stores the session data on the client within a cookie
- express.urlencoded: parses incoming requests with URL-encoded payloads
- express.json: parses incoming requests with JSON payloads
- express-handlebars: template engine that replaces variables in a template file with actual values

## Technical Achievements
- **Lighthouse 100%**: 100% on all four lighthouses, provided screenshots in repo.

### Design/Evaluation Achievements
- **Twelve Site Accessible Tips**: 
  1. Provide informative, unique page titles: Added different titles for the login vs actual todo page
  2. Keep content clear and concise: Everything is kept very minimal and formatted simplistically for users to understand
  3. Provide sufficient contrast between foreground and background: Colors are are chosen to have clear contrast
  4. Don’t use color alone to convey information: Urgency is colored while also provided with text to associate the urgency level with a color
  5. Ensure that form elements include clearly associated labels: All textboxes are clearly labeled for easy understanding
  6. Provide easily identifiable feedback: Login page gives feedback on any missing fields or if the login is incorrect
  7. Associate a label with every form control: Every form item has an associated label
  8. Include alternative text for images: Alternative text is added for the login todo image
  9. Identify page language and language changes: Primary language is indicated on every page, html lang="en"
  10. Help users avoid and correct mistakes: Errors shown on login page when mistakes occur
  11. Reflect the reading order in the code order: Code is ordered the same way as the reading order
  12. Ensure that all interactive elements are keyboard accessible: Everything can be accessed by just the keyboard
