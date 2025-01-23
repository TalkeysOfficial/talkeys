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
