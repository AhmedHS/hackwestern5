# API Documentation

## Inserting a preference
```
const lib = require('lib');
    
    lib.ahmedhs.lbc.prefIns({name: 'spockity'}, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log(result);
    
});
```

## Deleting a preference:

```
const lib = require('lib');
    lib.ahmedhs.lbc.prefDel({id: '5bf97cc63c170b0007c0fec9'}, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log(result);
});
```

## Modifying a preference:
```
const lib = require('lib');
    
     lib.ahmedhs.lbc.prefMod({id: '5bf975c82d00560007706dcb', newName: 'newSpock'}, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    
});
```

## Getting a preference
```
const lib = require('lib');
    
     lib.ahmedhs.lbc.prefGet({name: 'spock'}, function (err, result) {
      if (err) {
        console.log(err);
      }
      // do something with result
    
    });
```