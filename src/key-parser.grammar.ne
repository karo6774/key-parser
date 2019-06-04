@{% 
const solvers = require("./key-solvers");

// import the parsed key classes
const ParsedLiteralKey = solvers.ParsedLiteralKey;
const ParsedBlockKey = solvers.ParsedBlockKey;
const ParsedOrKey = solvers.ParsedOrKey;
const ParsedAndKey = solvers.ParsedAndKey;
%}

 # Entry
main 		-> block {% id %}

 # A block is either formatted 'allow!disallow' or just 'allow'
block 		-> or_seq _ "!" _ or_seq            {% data => ParsedBlockKey.make(data) %}
      		 | or_seq {% id %}

# Logical operators, in order of importance:
# OR logical operator: 'key,key'
or_seq 		-> and_seq _ ("," _ and_seq):+      {% data => ParsedOrKey.make(data) %}
             | key_block {% id %}

 # AND logical operator: 'key&key'
and_seq     -> key_block _ ("&" _ key_block):+  {% data => ParsedAndKey.make(data) %}
             | key_block {% id %}

 # A key block can either be one key, or a block of keys if they are surrounded with parenthesis.
key_block   -> "(" _ block _ ")"                {% d => d[2] %}
             | key {% id %}

 # Adds 'solver' property to the key
key 		-> key_literal                      {% data => ParsedLiteralKey.make(data) %}

key_literal	-> [^\,\&\(\)\!\s]:+                {% d => d[0].join("") %}
_ 			-> [\s]:*