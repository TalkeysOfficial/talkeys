# Team Creation API Endpoint

## Endpoint Description
Creates a new team with a unique team code and adds the current user as the team leader.

## Request Payload
```json
{
    "teamName": "HelloHimanish",
    "newPhoneNumber": "9814956560"
}
```

### Request Parameters
- `teamName` (String, Required): Name of the team
- `newPhoneNumber` (String, Required): User's phone number

## Response
```json
{
    "team": {
        "teamName": "HelloHimanish",
        "teamLeader": "678a933d0b89cdf0e2dcba3f",
        "teamCode": "AL7IKK",
        "teamMembers": [
            "678a933d0b89cdf0e2dcba3f"
        ],
        "maxMembers": 2,
        "_id": "6791e3a8e87260f8190fd962",
        "__v": 0
    },
    "teamCode": "AL7IKK"
}
```

### Response Fields
- `team`: Created team object
  - `teamName`: Provided team name
  - `teamLeader`: ID of team creator
  - `teamCode`: Unique 6-character code
  - `teamMembers`: Array of initial team member IDs
  - `maxMembers`: Maximum allowed team members
  - `_id`: Unique team identifier

## Authentication
- Requires user authentication
- Uses user's email from JWT token

## Validation
- Validates phone number format
- Ensures user exists in database
- Generates unique team code

## Potential Status Codes
- 201: Team successfully created
- 400: Invalid phone number
- 401: Unauthorized
- 404: User not found
- 500: Server error

# Team Join API Endpoint

## Endpoint Description
Allows a user to join an existing team using a team code.

## Request Payload
```json
{
    "teamCode": "AL7IKK",
    "phoneNumber": "9814956560"
}
```

### Request Parameters
- `teamCode` (String, Required): Unique team invitation code
- `phoneNumber` (String, Required): User's phone number

## Response
```json
{
    "teamName": "HelloHimanish",
    "teamLeader": "678a933d0b89cdf0e2dcba3f",
    "teamCode": "AL7IKK",
    "teamMembers": [
        "678a933d0b89cdf0e2dcba3f",
        "new_user_id"
    ],
    "maxMembers": 2,
    "_id": "6791e3a8e87260f8190fd962"
}
```

## Authentication
- Requires user authentication
- Uses user's email from JWT token

## Validation Checks
- Verifies user exists
- Confirms team exists
- Checks team is not full
- Validates phone number
- Prevents duplicate team membership

## Potential Status Codes
- 200: Successfully joined team
- 400: Team full or invalid phone number
- 404: Team or user not found
- 500: Server error


I'll generate comprehensive documentation for the `bookTicket` function:

# Team Ticket Booking API Documentation

## Overview
The `bookTicket` function is a critical API endpoint for team ticket booking. It allows team leaders to book event tickets for their entire team, ensuring a streamlined group registration process.

## Endpoint Details
- **Method**: POST
- **Authentication**: Required (OAuth middleware)
- **Access**: Team Leaders Only

## Request Payload
```json
{
    "teamcode": "TEAM123",
    "name": "Event Name",
    "slotId": "optional_slot_identifier"
}
```

### Request Parameters
- `teamcode` (String, Required): Unique team code identifying the team
- `name` (String, Required): Name of the event to book tickets for
- `slotId` (String, Optional): Specific event slot or time (not utilized in current implementation) (dont do this for now, this feature will be after esports)

## Authentication
- Requires valid OAuth token
- User ID is extracted from `req.user.id`
- Only team leaders can invoke this endpoint

## Business Logic Flow
1. **Team Validation**
   - Verify team exists using provided team code
   - Confirm requesting user is the team leader
   - Rejects request if team not found or user is not leader

2. **Event Verification**
   - Locate active and bookable event
   - Check ticket availability
   - Reject if event is not found or no tickets remain

3. **Ticket Booking Transaction**
   - Begins a MongoDB transaction for data integrity
   - Creates passes for all team members
   - Updates event ticket count
   - Tracks booked teams

## Possible Response Scenarios

### Successful Booking
- **Status Code**: 200 OK
- **Response Body**:
```json
{
    "message": "Team tickets booked successfully",
    "teamMembers": 5,
    "remainingTickets": 45
}
```

### Error Scenarios
1. **Team Not Found**
   - Status Code: 404
   - Message: "Team not found"

2. **Unauthorized Booking Attempt**
   - Status Code: 403
   - Message: "Only team leader can book tickets"

3. **Event Not Found**
   - Status Code: 404
   - Message: "Event not found"

4. **No Tickets Available**
   - Status Code: 400
   - Message: "No tickets available"

5. **Server Error**
   - Status Code: 500
   - Message: "Internal server error"

## Key Features
- Atomic transaction ensuring data consistency
- Team-wide ticket booking
- Leader-only access control
- Real-time ticket availability tracking

## Performance Considerations
- Uses MongoDB transaction for data integrity
- Efficient database queries
- Minimal payload requirements

## Potential Improvements
- Add slot selection logic
- Implement partial booking capabilities
- Enhanced error handling for edge cases

## Dependencies
- MongoDB Mongoose
- Express.js
- OAuth Middleware
- Event Model
- Team Model
- Pass Model

## Error Handling
- Comprehensive error logging
- Transactional rollback on failures
- Granular error responses

## Security Considerations
- Authentication required
- Team leader verification
- Transaction-based booking to prevent race conditions


## Monitoring & Logging
- Logs ticket booking attempts
- Tracks successful and failed bookings
- Captures detailed error information for debugging





# Get Team API Documentation

## Overview
Retrieves the team details for the authenticated user.

## Endpoint Details
- **Method**: GET
- **Authentication**: Required

## Request
- Requires OAuth token
- Uses authenticated user's email to find associated team

## Response Scenarios
### Success
- **Status**: 200 OK
- **Payload**: Complete team details
- **Includes**:
  - Team information
  - Team leader details
  - Team members details

### Error Scenarios
1. **User Not Found**
   - Status: 404
   - Message: "User not found"

2. **No Team Found**
   - Status: 404
   - Message: "No team found for this user"

3. **Server Error**
   - Status: 500
   - Message: Error details

## Key Improvements
- Added user existence check
- Added team existence check
- Populated leader and member details
- Provides specific error responses

## Security
- Authenticates via OAuth
- Scopes data to authenticated user

## Example Response
```json
{
    "teamName": "Tech Innovators",
    "teamCode": "ABC123",
    "teamLeader": {
        "name": "John Doe",
        "email": "john@example.com"
    },
    "teamMembers": [
        {"name": "Jane Smith", "email": "jane@example.com"},
        // More members...
    ]
}
```
