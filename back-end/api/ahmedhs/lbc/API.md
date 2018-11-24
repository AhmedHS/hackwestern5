# API Documentation

## Inserting a preference

### Wellness:
Name, Max time, Min time, Preferred start, preferred end, frequency (string -> Number/(day or week))
```
const lib = require('lib');

    lib.ahmedhs.lbc.prefIns({username: 'spock', start: 2, end: 3, prefStart: 3, prefEnd: 4, daysExcluded: ['Monday'], wellness: [['skiing', 5, 3,2,2,'1/week']]}, function (err, result) {
    if (err) {
        console.log(err);
    }
    // do something with the response
    
});
```

## Deleting a preference:

```
const lib = require('lib');
    lib.ahmedhs.lbc.prefDel({username: 'spock'}, function (err, result) {
    if (err) {
        console.log(err);
    }
    // do something with the response
});
```

## Modifying a preference:
```
const lib = require('lib');
    
     lib.ahmedhs.lbc.prefMod({username: 'spock', start: 1, end: 2, prefStart: 1, prefEnd: 1, daysExcluded: ['Monday', 'Tuesday'], wellness: [['skiing', 5, 3,2,2,'1/week']]}, function (err, result) {
      if (err) {
        console.log(err);
      }
     // do something with result    
});
```

## Getting a preference
```
const lib = require('lib');
    
     lib.ahmedhs.lbc.prefGet({username: 'spock'}, function (err, result) {
      if (err) {
        console.log(err);
      }
    //do something with result
});
```