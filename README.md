# One to one chat, by using socket.io

# STEPS FOR CHAT

- 1st user will send a post request to => http://127.0.0.1:3000/api/v1/conversations to startConversation

## Sample request body :

```
{
    "participant":{
        "userId": "6587f69bf31f13b43373ed66"
    }
}
```

## Sample response:

```
{
    "success": true,
    "conversation": {
        "_id": "658d550b83137b8a3d7627d1",
        "participants": [
            {
                "userId": "6587f69bf31f13b43373ed66",
                "userName": "Anamita Ghosh",
                "_id": "658d550b83137b8a3d7627d2"
            },
            {
                "userId": "658d0ab1fa6f66bd1d50a12a",
                "userName": "user",
                "_id": "658d550b83137b8a3d7627d3"
            }
        ],
        "messages": [],
        "__v": 0
    }
}
```

- 2nd: after that client will join a socket room by conversationId which he/she got from response.

```
socket.on("connect", () => {
      console.log("Connected to server");
      // join to the conversation room by using conversationId
      socket.emit("join", "658d550b83137b8a3d7627d1");
    });
```

- 3rd user will send post request to => http://127.0.0.1:3000/api/v1/conversations/messages for sending each message

## Sample request body :

```
{
    "conversationId":"658d550b83137b8a3d7627d1",
    "message":"Test message"
}
```

## Sample response:

```
{
    "success": true,
    "message": "Message sent successfully.",
    "conversation": {
        "_id": "658d550b83137b8a3d7627d1",
        "participants": [
            {
                "userId": "6587f69bf31f13b43373ed66",
                "userName": "Anamita Ghosh",
                "_id": "658d550b83137b8a3d7627d2"
            },
            {
                "userId": "658d0ab1fa6f66bd1d50a12a",
                "userName": "user",
                "_id": "658d550b83137b8a3d7627d3"
            }
        ],
        "messages": [
            {
                "senderId": "658d0ab1fa6f66bd1d50a12a",
                "receiverId": "6587f69bf31f13b43373ed66",
                "content": "Hi this is user",
                "_id": "658d6b992fcc0a9cfd0e48eb",
                "timeStamp": "2023-12-28T12:35:37.297Z"
            },
            {
                "senderId": "658d0ab1fa6f66bd1d50a12a",
                "receiverId": "6587f69bf31f13b43373ed66",
                "content": "Test message",
                "_id": "658d6fd3483da4a49404a553",
                "timeStamp": "2023-12-28T12:53:39.205Z"
            }
        ],
        "__v": 4
    }
}
```

- Then client can listen for the event

```
 socket.on("chat-message", (chat) => {
      console.log(chat);
    });
```
make changes successfully