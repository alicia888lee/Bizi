// Tool used to push custom business data to amplify

import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import inputFile from '../internal'

// adjust starting line if needed
const fs = require('fs');

var file_array = fs.readFileSync(inputFile)
    .toString()
    .split('\r\n')
    .slice(16);

console.log(file_array);