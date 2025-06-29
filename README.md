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

## 🛠️ **Dashboard Endpoints (Authenticated)**

---

#### `POST /dashboard/create-event`

**Description**: Create a new event.  
**Request Body**:
```json
{
  "isTeamEvent": false,
  "isPaid": true,
  "name": "AI Hackathon 2025",
  "category": "tech",
  "ticketPrice": 100,
  "mode": "offline",
  "location": "Main Hall",
  "duration": "3h",
  "slots": 100,
  "visibility": "public",
  "startDate": "2025-07-20T10:00:00.000Z",
  "startTime": "10:00 AM",
  "endRegistrationDate": "2025-07-19T23:59:59.000Z",
  "totalSeats": 100,
  "prizes": "Cash rewards and goodies",
  "eventDescription": "A 3-hour coding challenge focused on AI solutions.",
  "organizerContact": "9876543210"
}
```

**Response**:
```json
{
  "message": "Event created",
  "event": {
    "_id": "...",
    "name": "AI Hackathon 2025"
  }
}
```

---

#### `PUT /dashboard/edit-event/:id`

**Description**: Edit an existing event.  
**Request Body**:
```json
{
  "name": "AI Hackathon 2025 - Updated",
  "ticketPrice": 150,
  "location": "Auditorium B",
  "prizes": "Updated cash rewards and swag",
  "startTime": "11:00 AM"
}
```

**Response**:
```json
{
  "message": "Event updated successfully",
  "event": {
    "_id": "eventId",
    "name": "AI Hackathon 2025 - Updated"
  }
}
```

---

#### `GET /dashboard/event-analytics/:id`

**Description**: Get analytics for a specific event.  
**Response**:
```json
{
  "totalRegistrations": 2,
  "approvedCount": 1
}
```

---

#### `GET /dashboard/export-participants/:id`

**Description**: Export participant data for an event as CSV.  
**Response**:
```
"name","email","phone","status"
"Test User","testuser@example.com","9999999999","active"
```

---

#### `GET /dashboard/participants/:id`

**Description**: Get list of participants for an event.  
**Response**:
```json
{
  "participants": [
    {
      "_id": "passId",
      "userId": {
        "name": "Test User",
        "email": "testuser@example.com",
        "phoneNumber": "9999999999"
      },
      "status": "active",
      "passStatus": "active"
    }
  ]
}
```

---

#### `PUT /dashboard/approve-participant/:id`

**Description**: Approve a pending participant for an event.  
**Response**:
```json
{
  "message": "Participant approved",
  "pass": {
    "_id": "passId",
    "userId": "userId",
    "eventId": {
      "_id": "eventId",
      "name": "Hackathon 2025"
    },
    "status": "active",
    "passStatus": "active"
  }
}
```

