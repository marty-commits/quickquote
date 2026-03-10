# Easy Roof Estimate

## Business Requirements

- Purpose for roofing companies to deploy a webpage or widget as a lead generator qualifier to have potential customers come and get a ballpark idea of a roof replacement cost
- An MVP of a quick roofing estimating application as a web app similar to roofle.com or instant estimator by roofr.com   
- The web app should screen by screen progression of simple questions for front customer facing
- There will be 3 main pages, the first is front facing to the visitor and second as backend settings and third as backend reporting
- front facing progression, first screen enter address in a field above a map and once entered the map zooms into the top satellite image of their house/property with a light blue overlay of the exact top down shape of their house it needs to show as precise sqft measurements as possible and ask the pitch in three levels easy for the customer to understand. Additional optional steps could be to ask age of the current roof, current roof material, any current damage. Once pitch is chosen it will add the appropriate multiplier to give the updated squarefootage of roof and give a ranged estimate of the cost. Then the customer is asked for their contact info for contact with a professional finished quote (also free)
- In the Settings page you will set the per square pricing the range that you want the estimate to go below and above the number generated example 7% below and 10% above. Have the ability to offer more than one option if wanted (good, better, best). A financing option and way to set rates and range and a place to add the company branding to show up on app
- Keep it simple.
- The priority is a slick, professional, gorgeous UI/UX with very simple features
- The app should open with preset setting

## Technical Details

- Implemented as a modern NextJS app, client rendered
- The NextJS app should be created in a subdirectory `frontend`
- Persistence for settings
- No user management for the MVP
- Use popular libraries
- As simple as possible but with an elegant UI and engaging front end display and transitions

## Color Scheme

- Primary: '#1F3A5F'
- Secondary: '#4A6FA5'
- Background: '#F5F7FA'
- Text: '#2B2B2B'
- CTA Button: '#F97316'
- CTA Hover: '#EA580C'

## Strategy

1. Write plan with success criteria for each phase to be checked off. Include project scaffolding, including .gitignore, and rigorous unit testing.
2. Execute the plan ensuring all critiera are met
3. Carry out extensive integration testing with Playwright or similar, fixing defects
4. Only complete when the MVP is finished and tested, with the server running and ready for the user

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
