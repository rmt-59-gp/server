# Backpain API Documentation

## Endpoints :

List of available endpoints:

- `POST /users`


Routes below need authentication:

- `POST /rooms`
- `POST /rooms/join`
- `POST /rooms/:CodeRoom/join`

&nbsp;

## 1. POST /users

Description:
- Register a new user and login into the system

Request:

- body:

```json
{
    "name": "string"
}
```

_Response (201 - Created)_

```json
{
        "access_token": "string"
}
```

_Response (400 - BadRequest)_

```json
{
    "message": "Name is required"
}

```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /rooms

Description:
- Create a new room, the creator will be the host

Request:

- body:

```json
{
    "topic": "string"
}
```

_Response (200 - OK)_

```json
{
  "CodeRoom": "string",
  "question": ["question1", "question2", "question3", "question4", "question5"],
  "correctAnswer": "question2"
}
```

_Response (400 - BadRequest)_

```json
{
  "message": "Topic is required"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 3. POST /rooms/join

Description:
- Join the room based on the code entered

Request:

- body:

```json
{
    "CodeRoom": "string"
}
```

_Response (200 - OK)_

```json

    {
    "UserId": "integer",
    "RoomId": "integer",
    "score": "integer"
    }

```

_Response (400 - BadRequest)_

```json
{
  "message": "CodeRoom is required"
}
```

_Response (404 - NotFound)_

```json
{
  "message": "Room not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 4. POST /rooms/:CodeRoom/join

Description:
- Join a room by sending the room code as a parameter (used to join from the room card list)

Request:

- params:

```json
{
  "CodeRoom": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "UserId": "integer",
    "RoomId": "integer",
    "score": "integer"
}
```

_Response (404 - NotFound)_

```json
{
  "message": "Room not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
## 5. POST /rooms/:roomId/answers

**Description**:
- Submit answers for a specific room.

**Request**:

- **Params**:
  ```json
  {
    "roomId": "integer (required)"
  }
  ```

- **Body**:
  ```json
  {
    "answers": [
      {
        "questionId": "integer",
        "answer": "string"
      }
    ]
  }
  ```

**_Response (200 - OK)_**:
```json
{
  "message": "Answers submitted successfully",
  "score": "integer"
}
```

**_Response (400 - BadRequest)_**:
```json
{
  "message": "Answers are required and must be an array"
}
```

**_Response (404 - NotFound)_**:
```json
{
  "message": "Room not found"
}
```

**_Response (500 - Internal Server Error)_**:
```json
{
  "message": "Internal server error"
}
```

---

## 6. POST /rooms/:roomId/start

**Description**:
- Start the game for a specific room.

**Request**:

- **Params**:
  ```json
  {
    "roomId": "integer (required)"
  }
  ```

**_Response (200 - OK)_**:
```json
{
  "message": "Game started successfully"
}
```

**_Response (404 - NotFound)_**:
```json
{
  "message": "Room not found"
}
```

**_Response (500 - Internal Server Error)_**:
```json
{
  "message": "Internal server error"
}
```

---

## 7. POST /rooms/:roomId/end

**Description**:
- End the game for a specific room and calculate the final scores.

**Request**:

- **Params**:
  ```json
  {
    "roomId": "integer (required)"
  }
  ```

**_Response (200 - OK)_**:
```json
{
  "message": "Game ended successfully",
  "leaderboard": [
    {
      "UserId": "integer",
      "name": "string",
      "score": "integer"
    }
  ]
}
```

**_Response (404 - NotFound)_**:
```json
{
  "message": "Room not found"
}
```

**_Response (500 - Internal Server Error)_**:
```json
{
  "message": "Internal server error"
}
```

---

## 8. GET /rooms/:roomId/leaderboard

**Description**:
- Retrieve the leaderboard for a specific room.

**Request**:

- **Params**:
  ```json
  {
    "roomId": "integer (required)"
  }
  ```

**_Response (200 - OK)_**:
```json
{
  "leaderboard": [
    {
      "UserId": "integer",
      "name": "string",
      "score": "integer"
    }
  ]
}
```

**_Response (404 - NotFound)_**:
```json
{
  "message": "Room not found"
}
```

**_Response (500 - Internal Server Error)_**:
```json
{
  "message": "Internal server error"
}
```
