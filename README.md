### Role: Frontend Developer
Frontend Implementation: Draggable Card Grid
Hey there! This README gives a quick rundown of how I tackled the frontend challenges for this project.

### The Goal:
The main objective was to build a React application displaying a grid of cards that could be rearranged using drag-and-drop. Additionally, clicking on a card should open a modal with a larger view of the image.

### My Approach:

Data Handling: Used react-query to fetch data, simulating API calls with localStorage for now. This keeps things simple and ensures the data sticks around even if you refresh the page.

Drag-and-Drop: The @atlaskit/pragmatic-drag-and-drop library enables drag-and-drop interactions for card rearrangement with customization options.

Saving Changes: To simulate backend persistence, a timer "saves" the card order to localStorage every 5 seconds, mimicking real-time backend interaction. A spinner and message indicate the "saving" process.

Material UI has been used for the all the layout and modal interactions.


### To run the project 
> npm run dev
