// Tool used to push custom business data to amplify

import pkg from 'aws-amplify'
import * as mutations from '../graphql/mutations.js'
import fs from 'fs'

const { API } = pkg;

const BUSINESS_ITEMS = 6

var inputFile = 'src/internal/businessInfo.txt';
// adjust starting line if needed

var file_array = fs.readFileSync(inputFile, {'encoding': 'utf-8'})
    .split('\r\n')
    .slice(15);

// make sure that indices are consistent with list

let updateDB = async() => {
    for (var business_ind = 0; business_ind < file_array.length; business_ind += BUSINESS_ITEMS) {
        var business_obj = {
            businessName: file_array[business_ind],
            businessDescription: file_array[business_ind + 1],
            policyList: file_array[business_ind + 2],
            businessPhone: file_array[business_ind + 3],
            businessURL: file_array[business_ind + 4],
            deliveryURL: file_array[business_ind + 5]
        };

        try {
            const newBusiness = await API.graphql({
                query: mutations.createBusiness,
                variables: {input: business_obj},
                authMode: 'AWS_IAM'
            });
            console.log(newBusiness);
        }
        catch(error) {
            console.log(error);
        }
    }
}

updateDB();

// console.log(process.cwd());
// console.log(file_array);