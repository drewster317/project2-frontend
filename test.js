curl --request POST --header "Authorization: Token token=613669417cc00f9a92647898a9481c86" --header "Content-Type: application/json" -d '{
  "profile": {
    "first_name":"Drew",
    "last_name":"McMullen",
    "comment": "AJAX sucks",
    "user_id": 5
  }
}'  http://localhost:3000/profiles
