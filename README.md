# Trackzio - Movie Discovery App

Trackzio is a full-stack movie discovery application that allows users to discover movies, search for titles, explore categories, sort results, view detailed movie information, and maintain a persistent wishlist.

The application uses a React frontend and Node.js/Express backend. Movie information is retrieved from the OMDb API through the backend, while wishlist data is persisted using MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Business Problem](#business-problem)
- [Dataset](#dataset)
- [Tools & Technologies](#tools--technologies)
- [Project Structure](#project-structure)
- [Research Questions & Key Findings](#research-questions--key-findings)
- [How to Run This Project](#how-to-run-this-project)
- [API Architecture](#api-architecture)
- [Important Technical Decisions](#important-technical-decisions)
  - [Backend Abstraction](#backend-abstraction)
  - [Movie Data Normalization](#movie-data-normalization)
  - [Request Cancellation](#request-cancellation)
  - [State Management](#state-management)
  - [Database](#database)
  - [Rate Limiting](#rate-limiting)
  - [Responsive Design](#responsive-design)
  - [Assumptions](#assumptions)
  - [Known Limitations](#known-limitations)
- [Final Recommendations](#final-recommendations)
- [AI Usage](#ai-usage)
- [Author & Contact](#author--contact)

---

## Overview

Trackzio was developed as a full-stack movie discovery application.

The main goal was to create a movie browsing experience that feels like a real product rather than a simple third-party API demonstration.

### Main Features

- Browse movies without searching first
- Search for movies
- Explore movies by categories/genres
- Sort movies by:
  - Popular
  - Top Rated
  - Newest
  - Oldest
- Paginate through large search results
- View detailed movie information
- Add and remove movies from a wishlist
- Persist wishlist data across browser sessions
- Responsive design for desktop, tablet, and mobile devices
- Loading, empty, and error states
- Backend caching to reduce repeated external API requests
- Request cancellation when users rapidly change searches or filters
- Backend rate limiting and error handling

---

## Business Problem

Finding movies through a large catalog can become difficult when users have no specific title in mind.

A movie discovery application should therefore allow users to:

- Discover movies immediately
- Search for specific titles
- Narrow results using categories
- Change result ordering
- Continue exploring large result sets
- View detailed information before deciding
- Save interesting movies for later

The application also needs to handle real-world conditions such as slow external APIs, incomplete movie data, repeated requests, rapid filter changes, and API rate limitations.

Trackzio addresses these requirements by placing a Node.js backend between the frontend and the external movie API.

---

## Dataset

Trackzio does not use a static dataset.

Movie information is retrieved dynamically from the **OMDb API**, which provides information such as:

- Movie title
- Release year/date
- Poster
- Plot/description
- IMDb rating
- IMDb vote count
- Genre
- Runtime
- Actors
- Directors
- IMDb ID
- Awards
- Content rating

The backend transforms the external API response into a consistent movie format before sending it to the React frontend.

### Data Flow

```text
OMDb API
   ↓
Node.js / Express Backend
   ↓
Movie Service
   ↓
formatMovie()
   ↓
Application Movie Format
   ↓
React Frontend

Wishlist information is stored separately in MongoDB.

React Frontend
      ↓
Node.js API
      ↓
Wishlist Controller
      ↓
Mongoose Model
      ↓
MongoDB
```
---

## Tools & Technologies
### Frontend
React.js
React Router
JavaScript (ES6+)
Tailwind CSS
Lucide React
Zustand
Vite

### Backend
Node.js
Express.js
Axios
MongoDB
Mongoose
Express Rate Limit
dotenv
External Service
OMDb API
Development Tools
Git
GitHub
VS Code
Postman / Browser Developer Tools
---

## Project Structure
```
Trackzio/
│
├── backend/
│   ├── config/
│   │   ├── mongodb.js
│   │   └── movieApi.js
│   │
│   ├── controllers/
│   │   ├── movieController.js
│   │   └── wishlistController.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── rateLimitMiddleware.js
│   │
│   ├── models/
│   │   └── wishlistModel.js
│   │
│   ├── routes/
│   │   ├── movieRoute.js
│   │   └── wishlistRoute.js
│   │
│   ├── services/
│   │   └── movieService.js
│   │
│   ├── utils/
│   │   ├── cache.js
│   │   └── formatMovie.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── CategoryMenu.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── SortMenu.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── MovieContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── store/
│   │   │   └── wishlistStore.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Research Questions & Key Findings

Although this project is not a traditional data-analysis project, several technical and product questions guided the implementation.

1. How should users discover movies without searching?

The application provides an initial movie discovery experience so users can browse movies immediately after opening the application.

2. How should the application handle large search results?

Pagination is used to avoid rendering a large number of movies at once.

The backend also uses the pagination capabilities provided by the external movie API.

3. How can unnecessary external API requests be reduced?

The backend implements an in-memory caching layer.

Repeated requests for the same movie or search result can therefore be served from the backend cache instead of repeatedly calling the external API.

4. What happens when users rapidly change searches or filters?

The frontend uses request cancellation with AbortController.

Older requests can be cancelled when a newer request is initiated, helping prevent stale results from replacing newer results.

5. How should external movie data be represented?

The OMDb response is transformed through formatMovie() into a consistent application-specific movie structure.

This prevents the frontend from depending directly on the structure of the external API.

6. How should wishlist data persist?

Wishlist data is stored in MongoDB.

A client identifier is used to associate wishlist records with the browser session, allowing the wishlist to remain available after closing and reopening the application.

7. How should API failures be handled?

The backend provides centralized error handling for situations such as:

Request timeouts
External API failures
Rate limiting
Invalid requests
Missing data

The frontend displays appropriate loading, empty, and error states.
---

## How to Run This Project

Prerequisites
Make sure the following are installed:
Node.js
npm
MongoDB

You will also need an OMDb API key.

1. Clone the Repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Trackzio
2. Setup Backend
cd backend
npm install

Create a .env file inside the backend directory:

PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/trackzio
OMDB_API_KEY=your_omdb_api_key
CACHE_TTL=300000

Start the backend:

npm run server

The backend will run on:

http://localhost:5000

3. Setup Frontend
Open another terminal:

cd frontend
npm install

Create a .env file inside the frontend directory:

VITE_BACKEND_URL=http://localhost:5000

Start the frontend:

npm run dev

The frontend will run on:http://localhost:5173
---

## API Architecture

The frontend does not communicate directly with OMDb.

Instead, requests follow this architecture:

React
  ↓
Frontend API Service
  ↓
Express Route
  ↓
Controller
  ↓
Movie Service
  ↓
Cache
  ↓
OMDb API

For wishlist operations:

React
  ↓
Express Route
  ↓
Wishlist Controller
  ↓
Mongoose
  ↓
MongoDB

### Main Backend Endpoints
Method	Endpoint	Purpose
GET	/api/movies	Browse/search movies
GET	/api/movies/categories	Get movie categories
GET	/api/movies/:movieId	Get movie details
GET	/api/wishlist	Get wishlist
POST	/api/wishlist	Add movie to wishlist
DELETE	/api/wishlist/:movieId	Remove movie from wishlist
Caching Strategy

The backend uses an in-memory cache with a configurable TTL.

Cached information includes:

- Home/discovery movie data
- Search results
- Movie details

The cache reduces unnecessary requests to the external movie service and improves response times for repeated requests.

The cache duration can be configured through:

CACHE_TTL=300000
Wishlist Persistence

Wishlist information is stored in MongoDB.

Each wishlist record contains:

- Client ID
- Movie ID
- Movie title
- Poster
- Release year
- Rating
- Created timestamp
- Updated timestamp

A compound unique index on clientId and movieId prevents duplicate wishlist entries for the same client.
---

## Important Technical Decisions
### Backend abstraction
- The frontend communicates only with the Node.js backend.

- This keeps the external API key on the server and allows the backend to control caching, formatting, error handling, and rate limiting.

### Movie data normalization

- External OMDb responses are transformed into an application-specific structure using formatMovie().

### Request cancellation
- AbortController is used on the frontend to handle rapidly changing searches and filters.

### State management
- React Context is used for movie-related application state, while Zustand is used for wishlist state and persistence.

### Database
- MongoDB was selected for wishlist persistence because the stored movie data is document-oriented and simple to model.

### Rate limiting
- The backend includes request rate limiting to prevent excessive requests to the application.

### Responsive design
- Tailwind CSS responsive utilities are used to support different screen sizes, including mobile layouts.

### Assumptions
- OMDb is available as the external movie data provider.
- IMDb IDs are used as the unique movie identifiers.
- Movie posters and metadata are controlled by the external movie service.
- Wishlist persistence is associated with a browser-generated client identifier rather than a user authentication system.
- The application is currently designed without user account authentication.
- The external API may return incomplete movie information, so missing fields are handled with fallback values.

### Known Limitations
- The current wishlist system does not provide user authentication or account-based synchronization.
- The backend cache is in-memory, so cached data is cleared whenever the backend restarts.
- Movie discovery without a search query is based on a curated set of movie titles because the OMDb - API does not provide the same discovery-oriented catalog endpoint as some other movie APIs.
- The application depends on the availability and limitations of the OMDb API.
- External poster URLs may occasionally become unavailable.
---

## Final Recommendations

With additional development time, the application could be extended with:

- User authentication
- User-specific cloud wishlists
- Redis-based distributed caching
- More advanced filtering
- Infinite scrolling
- Trailer integration
- Similar movie recommendations
- Watch history
- Multiple movie providers
- Automated testing
- Production monitoring and logging
- Improved image fallback handling
- Production deployment with MongoDB Atlas
---

## AI Usage
AI-assisted development tools were used during the development of Trackzio.

AI was used to:

- Understand third-party API documentation
- Explore implementation approaches
- Generate and refine initial boilerplate
- Troubleshoot frontend and backend issues
- Review code structure
- Improve error handling
- Debug request and state-management behaviour
- Assist with documentation

The final application architecture, technology choices, data flow, database structure, and implementation decisions were reviewed and adapted as part of the development process.
---

## Author & Contact

Amrapali Bala

Frontend / Full-Stack Developer

GitHub: https://github.com/AmrapaliBala?tab=repositories
Portfolio: https://portfolio-react-tailwind-css-umber.vercel.app/
LinkedIn: https://www.linkedin.com/in/amrapali-bala-546b78252/
---