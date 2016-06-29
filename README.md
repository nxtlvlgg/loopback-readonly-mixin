# loopback-readonly-mixin
Loopback mixin to make model properties readonly, and allow write access for specific roles.

### Installation
`npm install https://github.com/nxtlvlgg/loopback-readonly-mixin.git --save`

### Instructions
Add the mixin to your loopback model:

```
{
    "name": "myModel",
    ...
    "mixins": {
        ...
        "Readonly": true
        ...
    }
    ...
}
```

Attach `Readonly` key to properties you wish to be readonly:

```
{
    "name": "myModel",
    ...
    "properties": {
        ...
        "myProperty": {
            "type": "string",
            ...
            "Readonly": true
            ...
        }
        ...
    }
    ...
    "mixins": {
        ...
        "Readonly": true
        ...
    }
    ...
}
```

You can also add the ability for specific roles to be allowed to write to a property. Include an array of accepted roles on the property:

```
{
    "name": "myModel",
    ...
    "properties": {
        ...
        "myProperty": {
            "type": "string",
            ...
            "Readonly": {
                "acceptedRoles": ["$someRole", "$admin"]
            }
            ...
        }
        ...
    }
    ...
    "mixins": {
        ...
        "Readonly": true
        ...
    }
    ...
}
```

### Dependancies
This mixin uses a custom method on the User model `User.isInRoles` to determine if the current access token being used has a role in `acceptedRoles` array.

### License
Copyright (c) 2016, Next Level Media Inc

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.