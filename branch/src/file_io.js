const fs = require('fs');
const path = require('path');

// Reading and parsing JSON file from given location
function get_loan_applications(input_file)
{
    let unparsed_loan_applications = fs.readFileSync(path.resolve(__dirname, '../'+input_file));
    loan_applications = JSON.parse(unparsed_loan_applications);
    return loan_applications;
}

// Printing output to given location
function print_sanctioned_loan_ids(sanctioned_loan_ids, output_file)
{
  var json = JSON.stringify(sanctioned_loan_ids);
  fs.writeFileSync(output_file, json);
}

module.exports = {
    get_loan_applications,
    print_sanctioned_loan_ids
}
