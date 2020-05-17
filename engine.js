"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');
var chalk = require('chalk');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

var headerLength = function(answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  );
};

//// indexOf wrapper for the list of objects
const insert = (arr, index, ...newItems) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted items
  ...newItems,
  // part of the array after the specified index
  ...arr.slice(index)
];

var keySort = function(array) {
  return array.sort(function(a, b) {
  return a.key - b.key
});
};
var maxSummaryLength = function(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};
var msgValues = function (msg, obj) {
  match = msg.match(/\[\w+\]/g);
  if (match) {
    var right = match[0].replace(/\[/g, ''), val = right.replace(/\]/g, ''); 
    return msg.replace(/\[\w+\]/g, obj[val]);  
  } else {
    return msg;
  }
};
var filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};
var MsgArray = function(options, key) {
  var opsArr = [], j=0;
  messages = options.messages;
  for (var mkey in messages) { 
    if (mkey == "Mgs"+key) {
      opsArr[j] = messages[mkey];
      j++;
    }
  }
  general = messages.general;
  for (x = 0; x < general.length; x++) {
    if (general[x].validate == true) {  
      opsArr[j] = {
        validate : function(subject, answers) {
          var filteredSubject = filterSubject(subject);
            return filteredSubject.length == 0
              ? 'subject is required'
              : filteredSubject.length <= (general[x].maxLengh ? 
              (general[x].maxLengh - headerLength(answers)) : maxSummaryLength(options, answers))
              ? true
              : 'Subject length must be less than or equal to ' +
               (general[x].maxLengh ? 
              (general[x].maxLengh - headerLength(answers)) : maxSummaryLength(options, answers)) +
                ' characters. Current length is ' +
                filteredSubject.length +
                ' characters.';
        }
      };
    }
    if (general[x].transformer == true) {
      opsArr[j] = {
        transformer : function(subject, answers) {
          var filteredSubject = filterSubject(subject);
          var color =
            filteredSubject.length <= maxSummaryLength(options, answers)
              ? chalk.green
              : chalk.red;
          return color('(' + filteredSubject.length + ') ' + subject);
        }
      };
    }
    if (general[x].filter == true) {
      opsArr[j] = {
        filter: function(subject) {
          return filterSubject(subject);
        }      
      };
    }
    if (general[x].type) {
      opsArr[j] = {type : general[x].type}; 
    }
    if (general[x].name) {
      opsArr[j]['name'] = general[x].name;
    }
    if (general[x].question) {
      opsArr[j]['message'] = msgValues(general[x].question, general[x]);
    }
    if (general[x].ref) {
      opsArr[j]['ref'] = general[x].ref;
    }
    if (general[x].key) {
      opsArr[j]['key'] = general[x].key;
    }
    if (general[x].yes) {
      subArr = general[x].yes;
      //console.log(subArr);
      var sArr, k=j+1;
      if (subArr instanceof Array) {
        for (var skey in subArr) {
          sArr = [];
          if (subArr[skey].type) {
            opsArr[k] = {type : subArr[skey].type}; 
          }
          if (subArr[skey].name) {
            opsArr[k]['name'] = subArr[skey].name;
          }  
          if (subArr[skey].question) {
            opsArr[k]['message'] = subArr[skey].question; 
          }
          if (subArr[skey].ref) {
            opsArr[k]['ref'] = subArr[skey].ref;
          }
          if (subArr[skey].key) {
            opsArr[k]['key'] = subArr[skey].key;
          }
          k++;          
        }
      } else {
        sArr = [];
        if (general[x].yes.type) {
          opsArr[k] = {type : general[x].yes.type};  
        }
        if (general[x].yes.name) {
          opsArr[k]['name'] = general[x].yes.name;
        }  
        if (general[x].yes.question) {
          opsArr[k]['message'] = general[x].yes.question; 
        }
        if (general[x].yes.ref) {
          opsArr[k]['ref'] = general[x].yes.ref;
        }
        if (general[x].yes.key) {
          opsArr[k]['key'] = general[x].yes.key;
        }
        console.log(general[x].yes);
      }  
    }  
    j++;
  }
  //keySort(opsArr); 
  console.log(opsArr);
  return opsArr;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {
  MsgArray(options, "Feat");
  var types = options.types;
  var format = options.format || '[emoji] [name]: [subject]';

  var length = longest(Object.keys(types)).length + 2;
  var choices = map(types, function (type, key) {
    var name = type.name || key;
    return {
      name: type.emoji + '\t' + rightPad(name + ':', length) + ' ' + type.description,
      value: {
        emoji: type.emoji,
        name: name,
      }
    };
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:',
          choices: choices,
          default: options.defaultType
        }, {
          type: 'input',
          name: 'subject',
          message: 'Write a short, imperative tense description of the change:\n'
        }, {
          type: 'input',
          name: 'body',
          message: 'Provide a longer description of the change:\n'
        }, {
          type: 'input',
          name: 'issues',
          message: 'List any issues closed by this change:\n'
        }
      ]).then(function(answers) {

        var wrapOptions = {
          trim: true,
          newline: '\n',
          indent:'',
          width: options.maxLineWidth
        };

        // Hard limit this line
        var head = format.replace(/\[emoji\]/g, answers.type.emoji)
          .replace(/\[name\]/g, answers.type.name)
          .replace(/\[subject\]/g, answers.subject.trim())
          .slice(0, maxLineWidth);
        // var head = (answers.type + ': ' + answers.subject.trim()).slice(0, maxLineWidth);

        // Wrap these lines at 100 characters
        var body = wrap(answers.body, wrapOptions);

        var issues = wrap(answers.issues, wrapOptions);

        var footer = filter([ issues ]).join('\n\n');

        commit(head + '\n\n' + body + '\n\n' + footer);
      });
    }
  };
};