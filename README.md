#API Endpoint 



---

## 📘 **Event API Documentation**

###  **Authentication Required**

Routes below `router.use(auth.verifyToken);` require a valid JWT token.

---

###  Public Endpoints

#### `GET /getEvents`

**Description**: Fetch all events with optional filters, pagination, and sorting.
**Query Parameters**:

* `page` (default: 1)
* `limit` (default: 10)
* `sortBy` (e.g. startDate)
* `order` (asc | desc)
* `mode` (e.g. online/offline)
* `category` (e.g. tech, music)
* `visibility` (public/private)
* `search` (searches eventName, description, category)
* `minPrice`, `maxPrice` (filter by ticket price range)

**Response**:

```json
{
  "status": "success",
  "data": {
    "events": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

---

#### `GET /getEventById/:id`

**Description**: Fetch a single event by its ID.
**Response**:

```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "eventName": "...",
    "availableSeats": 30,
    ...
  }
}
```

---



### 🔒 Authenticated Endpoints (require JWT)

#### `GET /likeEvent/:id`

**Description**: Like an event by its ID.
**Response**: `200 OK` on success.

---

#### `GET /unlikeEvent/:id`

**Description**: Unlike an event.
**Response**: `200 OK` on success.

---

#### `GET /getAllLikedEvents`

**Description**: Fetch list of liked event IDs for the logged-in user.
**Response**:

```json
{
  "status": "success",
  "likedEvents": ["eventId1", "eventId2"]
}
```

---
