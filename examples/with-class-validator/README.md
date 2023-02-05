## Run

```bash
deno run -A server.ts
```

## Api

```ts
POST http://localhost:8000/api/v1/user
```

## Result if wrong

```ts
{
    "status": 422,
    "message": [
        {
            "target": {},
            "property": "name",
            "children": [],
            "constraints": {
                "isString": "name must be a string"
            }
        },
        {
            "target": {},
            "property": "email",
            "children": [],
            "constraints": {
                "isEmail": "email must be an email"
            }
        },
        {
            "target": {},
            "property": "address",
            "children": [],
            "constraints": {
                "isString": "address must be a string"
            }
        }
    ],
    "name": "UnprocessableEntityError",
    "stack": [...]
}
```
