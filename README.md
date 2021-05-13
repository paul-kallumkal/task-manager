# Task Manager API  

### JSON data (when required) must be in the request body in a JSON format
### All Authorization should be sent as a bearer token in the request header
### Base link: https://generic-task-manager.herokuapp.com  
&nbsp;

## POST  
**Create User**  
Endpoint: /users  
JSON data: name, age, password, email  
(returns jwt-token)  

**Login**  
Endpoint: /users/login  
JSON data: email, password  
(returns jwt-token)  

**Create Task**  
Endpoint: /tasks  
Authorization: Bearer jwt-token  
JSON data: desc, completed (defaults to false)  

**Logout User**  
Endpoint: /users/logout  
Authorization: Bearer jwt-token  

**Logout of all sessions**  
Endpoint: /users/logoutAll  
Authorization: Bearer jwt-token  

## GET   
**User info**  
Endpoint: /users/me  
Authorization: Bearer jwt-token  

**Task list**  
Endpoint: /users/tasks  
Query parameter: completed = (true/false)  
Authorization: Bearer jwt-token  

## PATCH  
**Update User**  
Endpoint: /users/me  
JSON data: name, age, password, email (all arguments are optional)  
Authorization: Bearer jwt-token  

**Update Task**  
Endpoint: endpoint: /tasks:id  
JSON data: desc, completed (all arguments are optional)  
Authorization: Bearer jwt-token  

## DELETE   
**Delete Task**  
Endpoint: /tasks:id   
Authorization: Bearer jwt-token  

**Delete User**  
Endpoint: /users/me  
Authorization: Bearer jwt-token  
(cascade deletes tasks associated with user)  
